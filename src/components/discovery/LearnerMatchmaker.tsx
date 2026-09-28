"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, CheckCircle2, X, Compass, BookOpen, GraduationCap, Clock } from "lucide-react";
import styles from "./LearnerMatchmaker.module.css";

interface Props {
  onClose?: () => void;
  isOpenDefault?: boolean;
}

export default function LearnerMatchmaker({ onClose, isOpenDefault = false }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [subject, setSubject] = useState<string>("Mathematics");
  const [grade, setGrade] = useState<string>("High School");
  const [urgency, setUrgency] = useState<string>("soon");

  if (!isOpen) {
    return (
      <div className={styles.triggerBanner}>
        <div className={styles.triggerContent}>
          <div className={styles.triggerIconBadge}>
            <Compass size={20} className={styles.triggerIcon} />
          </div>
          <div>
            <h3 className={styles.triggerTitle}>Unsure which session is right for you?</h3>
            <p className={styles.triggerSubtitle}>
              Take our 30-second academic matchmaker to find live workshops tailored to your grade and goals.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={styles.triggerBtn}
        >
          <Sparkles size={16} />
          Find My Match
        </button>
      </div>
    );
  }

  const handleComplete = () => {
    const params = new URLSearchParams();
    if (subject && subject !== "All") params.set("subject", subject);
    if (grade && grade !== "All") params.set("grade", grade);
    if (urgency) params.set("sort", urgency);
    
    router.push(`/find?${params.toString()}`);
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className={styles.matchmakerCard}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.stepBadge}>Step {step} of 3</div>
          <h2 className={styles.title}>30-Second Learner Matchmaker</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className={styles.closeBtn}
          aria-label="Close matchmaker"
        >
          <X size={18} />
        </button>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className={styles.body}>
        {step === 1 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <BookOpen size={20} className={styles.stepIcon} />
              <div>
                <h3 className={styles.stepTitle}>What academic area do you need help with?</h3>
                <p className={styles.stepDesc}>Choose the primary subject you want to master or review.</p>
              </div>
            </div>

            <div className={styles.optionsGrid}>
              {[
                { title: "Mathematics", desc: "Algebra, Geometry, Precalculus & Calculus" },
                { title: "Science", desc: "Biology, Chemistry, Physics & Earth Science" },
                { title: "English & Writing", desc: "Essay construction, Literary Analysis & Grammar" },
                { title: "Standardized Testing", desc: "SAT, ACT, AP Exams & PSAT Prep" },
                { title: "Homework Help", desc: "Drop-in assignment problem-solving" },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setSubject(item.title)}
                  className={`${styles.optionCard} ${subject === item.title ? styles.optionSelected : ""}`}
                >
                  <div className={styles.optionRadio}>
                    {subject === item.title && <div className={styles.optionRadioInner} />}
                  </div>
                  <div>
                    <strong className={styles.optionTitle}>{item.title}</strong>
                    <span className={styles.optionDesc}>{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <GraduationCap size={20} className={styles.stepIcon} />
              <div>
                <h3 className={styles.stepTitle}>What is your current grade level?</h3>
                <p className={styles.stepDesc}>We match peer tutors who know your specific curriculum standard.</p>
              </div>
            </div>

            <div className={styles.optionsGrid}>
              {[
                { value: "Elementary", label: "Elementary (Grades K-5)", desc: "Foundational arithmetic, reading comprehension" },
                { value: "Middle School", label: "Middle School (Grades 6-8)", desc: "Pre-algebra, physical sciences, essay basics" },
                { value: "High School", label: "High School (Grades 9-12)", desc: "Algebra II, Geometry, Chem/Bio/Physics, AP courses" },
                { value: "College Prep", label: "College & AP Prep", desc: "AP Calculus, AP Chem, College admissions & essays" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setGrade(item.value)}
                  className={`${styles.optionCard} ${grade === item.value ? styles.optionSelected : ""}`}
                >
                  <div className={styles.optionRadio}>
                    {grade === item.value && <div className={styles.optionRadioInner} />}
                  </div>
                  <div>
                    <strong className={styles.optionTitle}>{item.label}</strong>
                    <span className={styles.optionDesc}>{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <Clock size={20} className={styles.stepIcon} />
              <div>
                <h3 className={styles.stepTitle}>When are you ready to join a workshop?</h3>
                <p className={styles.stepDesc}>All workshops are hosted live with authenticated Zoom classrooms.</p>
              </div>
            </div>

            <div className={styles.optionsGrid}>
              {[
                { value: "soon", label: "Starting Soonest (Today & Tomorrow)", desc: "Jump straight into an active or upcoming study group" },
                { value: "newest", label: "Newly Scheduled Sessions", desc: "Browse freshly scheduled curriculum modules this week" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setUrgency(item.value)}
                  className={`${styles.optionCard} ${urgency === item.value ? styles.optionSelected : ""}`}
                >
                  <div className={styles.optionRadio}>
                    {urgency === item.value && <div className={styles.optionRadioInner} />}
                  </div>
                  <div>
                    <strong className={styles.optionTitle}>{item.label}</strong>
                    <span className={styles.optionDesc}>{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as any)}
            className={styles.backBtn}
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as any)}
            className={styles.nextBtn}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            className={styles.finishBtn}
          >
            <CheckCircle2 size={16} />
            Show My Matched Sessions
          </button>
        )}
      </div>
    </div>
  );
}
