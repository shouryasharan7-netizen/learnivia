"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Calendar, Clock } from "lucide-react";

interface WorkshopSidebarDatesProps {
  startTime: string | Date;
  endTime: string | Date;
}

export default function WorkshopSidebarDates({
  startTime,
  endTime,
}: WorkshopSidebarDatesProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState({
    monthDay: "",
    durationMins: 0,
    fullDate: "",
    dateString: "",
    timeString: "",
  });

  useEffect(() => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      const durationMins = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      
      const monthDay = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const fullDate = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const dateString = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      
      const timeString = `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`;
      
      setData({
        monthDay,
        durationMins,
        fullDate,
        dateString,
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

  const {
    monthDay,
    durationMins,
    fullDate,
    dateString,
    timeString,
  } = data;

  return (
    <>
      <div className={styles.cardHeader}>
        <h3>{monthDay}</h3>
        <div className={styles.cardMeta}>
          <span><Calendar size={12} /> 1 Session</span>
          <span><Clock size={12} /> {durationMins} mins / session</span>
        </div>
        <p className={styles.nextSession}>Next session on {fullDate}</p>
      </div>
      
      <div className={styles.scheduleBox}>
        <span className={styles.scheduleLabel}>SCHEDULE</span>
        <div className={styles.scheduleTime}>
          <span>{dateString}</span>
          <span>{timeString}</span>
        </div>
      </div>
    </>
  );
}
