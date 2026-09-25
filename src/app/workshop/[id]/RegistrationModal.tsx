"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import styles from "./page.module.css";
import { enrollInWorkshop } from "@/app/actions/workshops";

interface Props {
  workshopId: string;
  tutorName: string;
  tutorInitials: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ workshopId, tutorName, tutorInitials, isOpen, onClose }: Props) {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.toLowerCase().trim() !== "i understand") {
      alert("Please type 'I understand' exactly to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("workshopId", workshopId);
      await enrollInWorkshop(formData);
      onClose();
      router.refresh(); // Refresh the page to show registered status
    } catch (err) {
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseBtn} onClick={onClose}><X size={20} /></button>
        
        <h2 className={styles.modalTitle}>Registration Questions</h2>
        
        <div className={styles.modalTutorBadge}>
          <div className={styles.modalAvatar}>{tutorInitials}</div>
          <span className={styles.modalTutorName}>{tutorName} <span className={styles.tutorLabel}>Tutor</span></span>
        </div>

        <div className={styles.modalQuestionBox}>
          <p>To complete your registration, please answer a couple of questions!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.policyBox}>
            <div className={styles.policyHeader}>✋ ATTENDANCE POLICY</div>
            <p className={styles.policyText}>Free to attend or skip any sessions</p>
          </div>

          <label className={styles.modalLabel}>
            Please type &quot;I understand&quot; to acknowledge the above attendance policy. <span className={styles.required}>*</span>
          </label>
          <input 
            type="text" 
            placeholder="I understand" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={styles.modalInput}
            required
          />

          <div className={styles.modalActions}>
            <button type="submit" disabled={isSubmitting || inputText.toLowerCase().trim() !== "i understand"} className={styles.modalSubmitBtn}>
              {isSubmitting ? "Registering..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
