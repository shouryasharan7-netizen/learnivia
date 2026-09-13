"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, FolderOpen, BookOpen, Wrench, Shield, Users } from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

interface CollapsibleResourcesProps {
  children?: React.ReactNode;
  hasChildProfiles?: boolean;
}

export function CollapsibleResources({ children, hasChildProfiles }: CollapsibleResourcesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section aria-labelledby="resources-collapsible-heading">
      <div className={styles.collapsibleCard}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.collapsibleTrigger}
          aria-expanded={isOpen}
          id="resources-collapsible-heading"
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <FolderOpen size={18} color="var(--wa-green)" />
            Additional Resources {hasChildProfiles ? "& Child Profiles" : "& Study Guides"}
          </span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isOpen && (
          <div className={styles.collapsibleBody}>
            {children}

            <div className={styles.resourceLinksRow}>
              <Link href={ROUTES.resources} className={styles.resourceLinkItem}>
                <BookOpen size={15} /> All Learning Resources
              </Link>
              <Link href={ROUTES.resourcesStudyGuides} className={styles.resourceLinkItem}>
                <BookOpen size={15} /> Subject Study Guides
              </Link>
              <Link href={ROUTES.resourcesTools} className={styles.resourceLinkItem}>
                <Wrench size={15} /> Interactive Learning Tools
              </Link>
              <Link href={ROUTES.safety} className={styles.resourceLinkItem}>
                <Shield size={15} /> Child Safeguarding Standards
              </Link>
              <Link href={ROUTES.safetyReport} className={styles.resourceLinkItem}>
                <Shield size={15} /> Report an Incident
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
