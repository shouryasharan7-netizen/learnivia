"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import styles from "./TopBar.module.css";

export function TopBar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("learnivia-theme");
    if (savedTheme) {
      setTimeout(() => setTheme(savedTheme), 0);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("learnivia-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div
      className={styles.topBar}
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      <div className={styles.container}>
        <div className={styles.left}>
          {/* Social Icons */}
          <a
            href="https://twitter.com/learnivia"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Learnivia on Twitter (opens in new tab)"
          >
            <FaTwitter size={14} />
          </a>
          <a
            href="https://instagram.com/learnivia"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Learnivia on Instagram (opens in new tab)"
          >
            <FaInstagram size={14} />
          </a>
          <a
            href="https://linkedin.com/company/learnivia"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Learnivia on LinkedIn (opens in new tab)"
          >
            <FaLinkedin size={14} />
          </a>
          <a
            href="https://facebook.com/learnivia"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Learnivia on Facebook (opens in new tab)"
          >
            <FaFacebook size={14} />
          </a>
        </div>

        <div className={styles.right}>
          {/* Theme Toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Student Login */}
          <Link href="/signin" className={styles.loginLink}>
            Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}
