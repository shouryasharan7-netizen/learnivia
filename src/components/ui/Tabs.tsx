"use client";

import { useId, useRef, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export function Tabs({ label, items, value, onChange }: { label: string; items: { value: string; label: string; content: ReactNode }[]; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return <div>
    <div className={styles.list} role="tablist" aria-label={label}>
      {items.map((item, index) => <button key={item.value} ref={element => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={value === item.value} tabIndex={value === item.value ? 0 : -1} className={styles.tab} onClick={() => onChange(item.value)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % items.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = items.length - 1;
        else return;
        event.preventDefault();
        onChange(items[next].value);
        buttons.current[next]?.focus();
      }}>{item.label}</button>)}
    </div>
    {items.map((item, index) => <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0} hidden={value !== item.value} className={styles.panel}>{item.content}</div>)}
  </div>;
}
