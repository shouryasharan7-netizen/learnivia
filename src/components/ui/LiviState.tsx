import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./LiviState.module.css";

const poses = { thinking: "/mascot/livi-thinking.png", success: "/mascot/livi-success.png", welcome: "/mascot/livi-heart.png" };

/** Copy and actions come from the real workflow; the mascot never implies a backend status. */
export function LiviState({ title, description, pose = "thinking", action, compact = false }: { title: string; description: string; pose?: keyof typeof poses; action?: ReactNode; compact?: boolean }) {
  return <div className={styles.state} data-compact={compact}>
    <Image src={poses[pose]} alt="" width={200} height={200} sizes={compact ? "96px" : "(max-width: 767px) 144px, 176px"} className={styles.mascot} />
    <h2>{title}</h2><p>{description}</p>{action && <div className={styles.action}>{action}</div>}
  </div>;
}
