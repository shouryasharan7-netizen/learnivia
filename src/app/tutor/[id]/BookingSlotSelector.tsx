"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Globe, Clock, Check } from "lucide-react";
import styles from "./booking-slot.module.css";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

interface BookingSlotSelectorProps {
  availabilities: AvailabilitySlot[];
  tutorTimezone: string;
  defaultViewerTimezone?: string | null;
}

// Convert a tutor weekly recurring slot into viewer timezone
function convertSlotTimes(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  tutorTz: string,
  viewerTz: string
) {
  try {
    // Pick reference week: Sunday 2026-09-13 to Saturday 2026-09-19
    const refDay = 13 + dayOfWeek;
    const refDateStr = `2026-09-${refDay < 10 ? "0" + refDay : refDay}`;

    function getTzOffsetMs(tz: string, date: Date): number {
      try {
        const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
        const tzStr = date.toLocaleString("en-US", { timeZone: tz });
        return new Date(tzStr).getTime() - new Date(utcStr).getTime();
      } catch {
        return 0;
      }
    }

    // Determine UTC instant of tutor's start time
    const guessStartUtc = new Date(`${refDateStr}T${startTime}:00Z`).getTime();
    let offset = getTzOffsetMs(tutorTz, new Date(guessStartUtc));
    let exactStartUtc = new Date(guessStartUtc - offset);
    offset = getTzOffsetMs(tutorTz, exactStartUtc);
    exactStartUtc = new Date(guessStartUtc - offset);

    // Determine UTC instant of tutor's end time
    const guessEndUtc = new Date(`${refDateStr}T${endTime}:00Z`).getTime();
    const exactEndUtc = new Date(guessEndUtc - offset);

    const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: viewerTz });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: viewerTz,
    });

    const viewerDay = dayFormatter.format(exactStartUtc);
    const viewerStart = timeFormatter.format(exactStartUtc);
    const viewerEnd = timeFormatter.format(exactEndUtc);

    return {
      viewerDay,
      viewerStart,
      viewerEnd,
      isSameDay: viewerDay === DAYS_OF_WEEK[dayOfWeek],
      tutorDay: DAYS_OF_WEEK[dayOfWeek],
      tutorStart: startTime,
      tutorEnd: endTime,
    };
  } catch (err) {
    console.warn("Timezone conversion fallback:", err);
    return {
      viewerDay: DAYS_OF_WEEK[dayOfWeek],
      viewerStart: startTime,
      viewerEnd: endTime,
      isSameDay: true,
      tutorDay: DAYS_OF_WEEK[dayOfWeek],
      tutorStart: startTime,
      tutorEnd: endTime,
    };
  }
}

export function BookingSlotSelector({
  availabilities,
  tutorTimezone,
  defaultViewerTimezone,
}: BookingSlotSelectorProps) {
  const [viewerTimezone, setViewerTimezone] = useState<string>(
    defaultViewerTimezone || "UTC"
  );
  const [mounted, setMounted] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isChangingTimezone, setIsChangingTimezone] = useState(false);

  useEffect(() => {
    try {
      const detected =
        defaultViewerTimezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC";
      setViewerTimezone(detected);
    } catch {
      setViewerTimezone(defaultViewerTimezone || "UTC");
    }
    setMounted(true);
  }, [defaultViewerTimezone]);

  const convertedSlots = useMemo(() => {
    return availabilities.map((slot) => {
      const converted = convertSlotTimes(
        slot.dayOfWeek,
        slot.startTime,
        slot.endTime,
        tutorTimezone || "UTC",
        viewerTimezone
      );
      return {
        ...slot,
        converted,
      };
    });
  }, [availabilities, tutorTimezone, viewerTimezone]);

  const selectedSlot = convertedSlots.find((s) => s.id === selectedSlotId);

  // Common timezones for quick selection
  const commonTimezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
    "UTC",
  ];

  return (
    <div className={styles.slotSelectorContainer}>
      <div className={styles.timezoneBadge}>
        <div className={styles.timezoneBadgeHeader}>
          <Globe size={14} className={styles.globeIcon} aria-hidden="true" />
          <span className={styles.timezoneText}>
            Times converted to your local timezone:{" "}
            <strong>{mounted ? viewerTimezone : tutorTimezone}</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsChangingTimezone(!isChangingTimezone)}
            className={styles.changeTzBtn}
          >
            {isChangingTimezone ? "Done" : "Change"}
          </button>
        </div>

        {isChangingTimezone && (
          <div className={styles.timezonePickerDropdown}>
            <label htmlFor="customTimezoneSelect" className={styles.pickerLabel}>
              Select your preferred timezone:
            </label>
            <select
              id="customTimezoneSelect"
              value={viewerTimezone}
              onChange={(e) => {
                setViewerTimezone(e.target.value);
                setIsChangingTimezone(false);
              }}
              className={styles.pickerSelect}
            >
              {!commonTimezones.includes(viewerTimezone) && (
                <option value={viewerTimezone}>{viewerTimezone} (Detected)</option>
              )}
              {commonTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.selectWrapper}>
        <label htmlFor="slotSelect" className={styles.selectLabel}>
          Available Time Slot *
        </label>
        <select
          id="slotSelect"
          name="slotId"
          required
          value={selectedSlotId}
          onChange={(e) => setSelectedSlotId(e.target.value)}
          className={styles.slotDropdown}
        >
          <option value="">Choose an available time...</option>
          {convertedSlots.map((slot) => {
            const c = slot.converted;
            const isSameTz = viewerTimezone === (tutorTimezone || "UTC");
            return (
              <option key={slot.id} value={slot.id}>
                {c.viewerDay} {c.viewerStart} – {c.viewerEnd}
                {isSameTz
                  ? ` (${viewerTimezone})`
                  : ` (Your time: ${viewerTimezone}) • Tutor: ${c.tutorDay} ${c.tutorStart}`}
              </option>
            );
          })}
        </select>
      </div>

      {selectedSlot && (
        <div className={styles.slotPreviewCard}>
          <div className={styles.previewItem}>
            <Clock size={14} className={styles.previewIcon} />
            <div className={styles.previewTextGroup}>
              <span className={styles.previewTitle}>Your Local Session Time</span>
              <span className={styles.previewTime}>
                <strong>
                  {selectedSlot.converted.viewerDay} {selectedSlot.converted.viewerStart} –{" "}
                  {selectedSlot.converted.viewerEnd}
                </strong>{" "}
                ({viewerTimezone})
              </span>
            </div>
          </div>
          {viewerTimezone !== (tutorTimezone || "UTC") && (
            <div className={styles.tutorTzNote}>
              Tutor&apos;s local time: {selectedSlot.converted.tutorDay}{" "}
              {selectedSlot.converted.tutorStart} – {selectedSlot.converted.tutorEnd} (
              {tutorTimezone || "Tutor Local"})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
