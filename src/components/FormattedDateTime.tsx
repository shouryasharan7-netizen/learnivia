"use client";

import { useEffect, useState } from "react";

interface FormattedDateTimeProps {
  date: string | Date;
  fallbackText?: string;
  className?: string;
  userTimezone?: string | null;
}

export function FormattedDateTime({
  date,
  fallbackText,
  className,
  userTimezone,
}: FormattedDateTimeProps) {
  const [clientText, setClientText] = useState<string>("");

  useEffect(() => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return;

      const timeZone = userTimezone || undefined;

      const datePart = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone,
      });

      const timePart = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone,
      });

      setClientText(`${datePart} at ${timePart}`);
    } catch {
      // Fallback if timezone string is invalid
      try {
        const d = new Date(date);
        const datePart = d.toLocaleDateString();
        const timePart = d.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setClientText(`${datePart} at ${timePart}`);
      } catch {
        // Ignored
      }
    }
  }, [date, userTimezone]);

  if (!clientText) {
    const d = new Date(date);
    const datePart = !isNaN(d.getTime()) ? d.toLocaleDateString() : "";
    const timePart = !isNaN(d.getTime())
      ? d.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "";
    return (
      <span className={className}>
        {fallbackText || (datePart ? `${datePart} at ${timePart}` : "")}
      </span>
    );
  }

  return <span className={className}>{clientText}</span>;
}
