import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import styles from "./Foundation.module.css";

const cx = (...values: (string | undefined)[]) => values.filter(Boolean).join(" ");
type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={cx(styles.button, styles[variant], className)} {...props} />;
}
export function ButtonLink({ variant = "primary", className, ...props }: React.ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cx(styles.button, styles[variant], className)} {...props} />;
}
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.card, className)} {...props} />;
}
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <header className={styles.pageHeader}><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className={styles.actions}>{actions}</div>}</header>;
}
export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{children}{hint && <p id={`${id}-hint`}>{hint}</p>}{error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}</div>;
}
// Pass aria-describedby (fieldId-hint / fieldId-error) and aria-invalid from the form's validation state.
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(styles.control, className)} {...props} />;
}
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(styles.control, className)} {...props} />;
}
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(styles.control, styles.textarea, className)} {...props} />;
}
export function StatusBadge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "error" | "info"; children: ReactNode }) {
  return <span className={styles.badge} data-tone={tone}>{children}</span>;
}
export function Skeleton({ width = "100%", height = "16px", className }: { width?: CSSProperties["width"]; height?: CSSProperties["height"]; className?: string }) {
  return <span aria-hidden="true" className={cx(styles.skeleton, className)} style={{ width, height }} />;
}
