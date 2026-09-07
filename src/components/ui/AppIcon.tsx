import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10H3Z" /><path d="M9 20v-7h6v7" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18" /></>,
  messages: <path d="M20 16H9l-5 4V5h16Z" />,
  community: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2" /></>,
  tutor: <><path d="M3 4h18v12H11M15 20h6" /><circle cx="6" cy="14" r="3" /><path d="M1 22a5 5 0 0 1 10 0" /></>,
  hours: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></>,
  bell: <><path d="M5 16V9a7 7 0 0 1 14 0v7l2 2H3ZM10 22h4" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  admin: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
};
export type AppIconName = "home" | "search" | "calendar" | "messages" | "community" | "tutor" | "hours" | "bell" | "profile" | "close" | "chevron" | "admin";
export function AppIcon({ name }: { name: AppIconName }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
