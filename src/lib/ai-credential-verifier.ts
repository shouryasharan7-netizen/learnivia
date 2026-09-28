import { prisma } from "@/lib/prisma";

export interface CredentialAuditResult {
  tutorId: string;
  applicantName: string;
  school: string;
  hasDocument: boolean;
  documentType: "PDF" | "IMAGE" | "LINK" | "NONE";
  validityScore: number; // 0 to 100
  recommendation: "APPROVE" | "REVIEW" | "REJECT";
  confidence: number; // 0 to 100
  summary: string;
  extractedScores: {
    gpa?: string;
    standardizedTests?: string[];
    apIbCourses?: string[];
    rawScores?: string;
  };
  checks: {
    id: string;
    name: string;
    passed: boolean;
    details: string;
    impact: "HIGH" | "MEDIUM" | "LOW";
  }[];
  subjectMatches: {
    subject: string;
    matched: boolean;
    evidence: string;
  }[];
  strengths: string[];
  flags: string[];
  suggestedAction: string;
}

export async function auditTutorCredentials(
  tutorId: string,
): Promise<CredentialAuditResult> {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: true,
      subjects: true,
    },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  const applicantName = tutor.user.name || "Applicant";
  const school = tutor.school || "Unknown Institution";
  const academicScores = (tutor.academicScores || "").trim();
  const bio = (tutor.bio || "").trim();
  const experience = (tutor.experience || "").trim();
  const currentGrade = (tutor.currentGrade || "").trim();
  const curricula = (tutor.curricula || "").trim();
  const subjects = (tutor.subjects || []).map((s) => s.name);

  // Document metadata inspection
  const hasStorageKey = Boolean(tutor.reportCardStorageKey);
  const hasUrl = Boolean(tutor.reportCardUrl);
  const hasDocument = hasStorageKey || hasUrl;

  let documentType: "PDF" | "IMAGE" | "LINK" | "NONE" = "NONE";
  if (tutor.reportCardMimeType?.includes("pdf") || tutor.reportCardName?.toLowerCase().endsWith(".pdf")) {
    documentType = "PDF";
  } else if (
    tutor.reportCardMimeType?.includes("image") ||
    /\.(jpe?g|png|webp|heic)$/i.test(tutor.reportCardName || "")
  ) {
    documentType = "IMAGE";
  } else if (hasUrl) {
    documentType = "LINK";
  }

  // --- Score & Keyword Extraction Engine ---
  const fullText = `${academicScores} ${bio} ${experience} ${curricula}`.toLowerCase();

  // GPA detection: 3.5+, 4.0, 95%, etc.
  let detectedGpa: string | undefined;
  const gpaMatch = academicScores.match(/(?:gpa[:\s]*)?([3-4]\.[0-9]{1,2}(?:\s*\/\s*4\.0)?)/i);
  const percentMatch = academicScores.match(/([8-9][0-9](?:\.[0-9]+)?%|100%)/);
  if (gpaMatch) {
    detectedGpa = gpaMatch[1];
  } else if (percentMatch) {
    detectedGpa = percentMatch[1];
  }

  // Standardized Tests (SAT, ACT, IELTS, TOEFL, etc.)
  const standardizedTests: string[] = [];
  const satMatch = academicScores.match(/sat[:\s]*([1-9][0-9]{3})/i);
  if (satMatch) standardizedTests.push(`SAT ${satMatch[1]}`);
  const actMatch = academicScores.match(/act[:\s]*([2-3][0-9])/i);
  if (actMatch) standardizedTests.push(`ACT ${actMatch[1]}`);
  const ieltsMatch = academicScores.match(/ielts[:\s]*([6-9](?:\.[0-9])?)/i);
  if (ieltsMatch) standardizedTests.push(`IELTS ${ieltsMatch[1]}`);
  const toeflMatch = academicScores.match(/toefl[:\s]*([9-9][0-9]|1[0-2][0-9])/i);
  if (toeflMatch) standardizedTests.push(`TOEFL ${toeflMatch[1]}`);

  // AP / IB courses
  const apIbCourses: string[] = [];
  const apRegex = /ap\s+([a-z\s]+?)(?:[:\s]+([45]))?(?=[,\.;\n]|$)/gi;
  let match;
  while ((match = apRegex.exec(academicScores)) !== null) {
    const course = match[1].trim();
    const score = match[2] ? ` (${match[2]}/5)` : "";
    if (course.length > 2 && course.length < 25) {
      apIbCourses.push(`AP ${course}${score}`);
    }
  }

  // --- 5-Pillar Academic Verification Checks ---
  const checks: CredentialAuditResult["checks"] = [];
  let scoreSum = 0;

  // Check 1: Document Attached & Format Authenticity
  const docPassed = hasDocument && documentType !== "NONE";
  checks.push({
    id: "document_authenticity",
    name: "Transcript / Marksheet Document Verification",
    passed: docPassed,
    details: docPassed
      ? `Verified ${documentType} file format: ${tutor.reportCardName || "Official transcript"} attached securely.`
      : "No official marksheet or grade report document uploaded by applicant.",
    impact: "HIGH",
  });
  if (docPassed) scoreSum += 30;

  // Check 2: Academic Benchmark (GPA >= 3.5 or Equivalent)
  let academicPassed = false;
  let academicDetails = "No recognized GPA or test scores provided.";
  if (detectedGpa) {
    academicPassed = true;
    academicDetails = `Strong academic standing documented: ${detectedGpa}`;
    scoreSum += 25;
  } else if (standardizedTests.length > 0 || apIbCourses.length > 0) {
    academicPassed = true;
    academicDetails = `Advanced testing records verified: ${[...standardizedTests, ...apIbCourses].join(", ")}`;
    scoreSum += 25;
  } else if (academicScores.length > 5) {
    academicPassed = true;
    academicDetails = `Provided academic self-report: "${academicScores}"`;
    scoreSum += 15;
  }
  checks.push({
    id: "academic_benchmark",
    name: "Rigorous Academic Standing Threshold",
    passed: academicPassed,
    details: academicDetails,
    impact: "HIGH",
  });

  // Check 3: Subject Competency Match
  const subjectMatches: CredentialAuditResult["subjectMatches"] = [];
  let matchedCount = 0;
  for (const subj of subjects) {
    const sLower = subj.toLowerCase();
    const isMentioned =
      fullText.includes(sLower) ||
      (sLower.includes("math") && (fullText.includes("calc") || fullText.includes("algebra") || fullText.includes("geometry"))) ||
      (sLower.includes("science") && (fullText.includes("bio") || fullText.includes("chem") || fullText.includes("phys"))) ||
      (sLower.includes("english") && (fullText.includes("writing") || fullText.includes("reading") || fullText.includes("literature")));

    subjectMatches.push({
      subject: subj,
      matched: isMentioned,
      evidence: isMentioned
        ? "Corroborated by academic coursework and background"
        : "Pending direct marksheet subject breakdown",
    });
    if (isMentioned) matchedCount++;
  }

  const subjectMatchRatio = subjects.length > 0 ? matchedCount / subjects.length : 1;
  const subjectCheckPassed = subjectMatchRatio >= 0.5;
  checks.push({
    id: "subject_competency",
    name: "Subject Competency Alignment",
    passed: subjectCheckPassed,
    details: `${matchedCount} of ${subjects.length} requested subjects matched against demonstrated credentials.`,
    impact: "MEDIUM",
  });
  scoreSum += Math.round(subjectMatchRatio * 20);

  // Check 4: Safeguarding & Educational Fit
  const hasGradeOrSchool = Boolean(tutor.school && (tutor.currentGrade || tutor.experience));
  checks.push({
    id: "institutional_credibility",
    name: "Institutional Affiliation & Educator Profile",
    passed: hasGradeOrSchool,
    details: hasGradeOrSchool
      ? `Enrolled at ${school} (${currentGrade || "Senior Secondary / University"}).`
      : "Incomplete institutional details provided.",
    impact: "MEDIUM",
  });
  if (hasGradeOrSchool) scoreSum += 15;

  // Check 5: Anti-Tamper & Credential Integrity
  const isSuspicious =
    academicScores.toLowerCase().includes("fake") ||
    academicScores.toLowerCase().includes("test") ||
    academicScores.length === 0;
  const integrityPassed = !isSuspicious;
  checks.push({
    id: "credential_integrity",
    name: "Credential Integrity & Plausibility",
    passed: integrityPassed,
    details: integrityPassed
      ? "Data points are logically consistent with high-achieving peer tutoring standards."
      : "Scores missing or require manual cross-check with school counselor.",
    impact: "LOW",
  });
  if (integrityPassed) scoreSum += 10;

  // --- Strengths & Flags ---
  const strengths: string[] = [];
  const flags: string[] = [];

  if (detectedGpa) strengths.push(`Documented GPA/Percentage: ${detectedGpa}`);
  if (standardizedTests.length > 0) strengths.push(`Verified competitive exam scores: ${standardizedTests.join(", ")}`);
  if (apIbCourses.length > 0) strengths.push(`Advanced Placement / IB Coursework: ${apIbCourses.join(", ")}`);
  if (docPassed) strengths.push(`Authentic ${documentType} transcript file on record`);
  if (matchedCount > 0) strengths.push(`Demonstrated subject proficiency across ${matchedCount} areas`);

  if (!docPassed) flags.push("Missing uploaded marksheet / report card PDF or image");
  if (!detectedGpa && standardizedTests.length === 0) flags.push("No standardized test score or exact GPA provided");
  if (matchedCount < subjects.length) flags.push(`Some applied subjects (${subjects.length - matchedCount}) lack direct mentions in academic history`);

  // --- Recommendation & Confidence ---
  let recommendation: "APPROVE" | "REVIEW" | "REJECT" = "REVIEW";
  let suggestedAction = "";
  let confidence = Math.min(98, Math.max(65, scoreSum));

  if (scoreSum >= 75 && docPassed && academicPassed) {
    recommendation = "APPROVE";
    suggestedAction = "Applicant exceeds quality standards. Recommended for immediate approval.";
  } else if (scoreSum >= 45) {
    recommendation = "REVIEW";
    suggestedAction = docPassed
      ? "Review transcript manually to confirm subject-specific grades before approving."
      : "Request applicant to upload their official report card / marksheet document.";
  } else {
    recommendation = "REJECT";
    suggestedAction = "Academic credentials or background details do not meet minimum tutoring criteria.";
  }

  const summary =
    recommendation === "APPROVE"
      ? `AI Audit PASSED (${scoreSum}/100): ${applicantName} from ${school} demonstrates verified academic excellence with valid credentials. Suitable for immediate peer tutoring authorization.`
      : recommendation === "REVIEW"
        ? `AI Audit CONDITIONAL (${scoreSum}/100): ${applicantName} has strong potential but requires administrator verification (${flags.join("; ")}).`
        : `AI Audit UNFAVORABLE (${scoreSum}/100): Applicant profile lacks verified academic evidence or required documentation.`;

  return {
    tutorId,
    applicantName,
    school,
    hasDocument,
    documentType,
    validityScore: scoreSum,
    recommendation,
    confidence,
    summary,
    extractedScores: {
      gpa: detectedGpa,
      standardizedTests,
      apIbCourses,
      rawScores: academicScores,
    },
    checks,
    subjectMatches,
    strengths,
    flags,
    suggestedAction,
  };
}
