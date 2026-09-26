"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Calendar, Clock } from "lucide-react";

interface WorkshopClientDatesProps {
  startTime: string | Date;
  endTime: string | Date;
  title: string;
  description: string;
}

export default function WorkshopClientDates({
  startTime,
  endTime,
  title,
  description,
}: WorkshopClientDatesProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState({
    dayNum: "",
    monthShort: "",
    weekday: "",
    timeString: "",
  });

  useEffect(() => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);

      const dayNum = start.toLocaleDateString("en-US", { day: "numeric" });
      const monthShort = start
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase();
      const weekday = start
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();

      const timeString = `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`;

      setData({
        dayNum,
        monthShort,
        weekday,
        timeString,
      });
      setIsMounted(true);
    } catch (e) {
      console.error(e);
    }
  }, [startTime, endTime]);

  if (!isMounted) {
    return <div style={{ opacity: 0 }}>Loading...</div>;
  }

  const { dayNum, monthShort, weekday, timeString } = data;

  return (
    <>
      <div className={styles.sessionsHeader}>
        <h2 className={styles.sectionTitle}>Sessions</h2>
        <div className={styles.sessionTabs}>
          <span className={styles.activeTab}>Upcoming</span>
          <span className={styles.inactiveTab}>All</span>
        </div>
      </div>

      <div className={styles.attendancePolicy}>
        <span className={styles.handEmoji}>✋</span>
        <strong>ATTENDANCE POLICY</strong>
        <p>Free to attend or skip any sessions</p>
      </div>

      <div className={styles.sessionBox}>
        <div className={styles.sessionBoxLeft}>
          <span className={styles.sessionLabel}>SESSION 1</span>
          <span className={styles.sessionDateNum}>{dayNum}</span>
          <span className={styles.sessionMonth}>{monthShort}</span>
        </div>
        <div className={styles.sessionBoxRight}>
          <h4 className={styles.sessionTitle}>{title}</h4>
          <p className={styles.sessionTime}>
            {weekday} {timeString}
          </p>
          <p className={styles.sessionDesc}>
            {description.length > 100
              ? description.substring(0, 100) + "..."
              : description}
          </p>
        </div>
      </div>
    </>
  );
}
