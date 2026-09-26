"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./LogoSplash.module.css";

interface LogoSplashProps {
  /** Optional callback when splash completes */
  onComplete?: () => void;
  /** Force show regardless of session storage */
  forceShow?: boolean;
}

export function LogoSplash({ onComplete, forceShow = false }: LogoSplashProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Determine if splash should display
    const hasShown = sessionStorage.getItem("learnivia_splash_shown");
    if (!hasShown || forceShow) {
      setTimeout(() => {
        setVisible(true);
        setMounted(true);
      }, 0);
      sessionStorage.setItem("learnivia_splash_shown", "true");

      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 1400);

      const removeTimer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    } else {
      onComplete?.();
    }
  }, [forceShow, onComplete]);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`${styles.splashOverlay} ${fadingOut ? styles.fadeOut : ""}`}
      onClick={() => {
        setFadingOut(true);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 300);
      }}
      role="dialog"
      aria-label="Welcome to Learnivia"
    >
      <div className={styles.splashCard}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.png"
            alt="Learnivia Fox Mascot"
            width={120}
            height={120}
            priority
            className={styles.mascotImage}
          />
        </div>
        <h1 className={styles.brandTitle}>Learnivia</h1>
        <div className={styles.tagline}>Free Peer-to-Peer Learning</div>

        {/* Subtle loading pulse bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
}

export default LogoSplash;
