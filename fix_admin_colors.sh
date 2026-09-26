#!/bin/bash
find src/app/admin -type f -name "*.tsx" | xargs perl -pi -e '
  s/background:\s*"(?:#FFFFFF|#fff|white)"/background: "var(--surface-raised, #FFFFFF)"/g;
  s/background:\s*"(?:#F8FAFC|#F9FAFB|#F1F5F9)"/background: "var(--surface-subtle, #F8FAFC)"/g;
  s/background:\s*"(?:#FEF2F2|#FEE2E2|#FECACA)"/background: "var(--error-light, #FEF2F2)"/g;
  s/background:\s*"(?:#ECFDF5|#F0FDF4|#BBF7D0|#EAF3ED)"/background: "var(--success-light, #ECFDF5)"/g;
  s/background:\s*"(?:#FEF9C3)"/background: "var(--warning-light, #FEF9C3)"/g;
  s/background:\s*"(?:#EFF6FF)"/background: "var(--info-light, #EFF6FF)"/g;
  
  s/backgroundColor:\s*"(?:#FFFFFF|#fff|white)"/backgroundColor: "var(--surface-raised, #FFFFFF)"/g;
  s/backgroundColor:\s*"(?:#F8FAFC|#F9FAFB|#F1F5F9)"/backgroundColor: "var(--surface-subtle, #F8FAFC)"/g;
  s/backgroundColor:\s*"(?:#FEF2F2|#FEE2E2|#FECACA)"/backgroundColor: "var(--error-light, #FEF2F2)"/g;
  s/backgroundColor:\s*"(?:#ECFDF5|#F0FDF4|#BBF7D0)"/backgroundColor: "var(--success-light, #ECFDF5)"/g;
  s/backgroundColor:\s*"(?:#FEF9C3)"/backgroundColor: "var(--warning-light, #FEF9C3)"/g;
  s/backgroundColor:\s*"(?:#EFF6FF)"/backgroundColor: "var(--info-light, #EFF6FF)"/g;

  s/color:\s*"(?:#0C1B33|#111827|#1F2937|black|#000000)"/color: "var(--text-primary, #0C1B33)"/g;
  s/color:\s*"(?:#475569|#64748B)"/color: "var(--text-secondary, #475569)"/g;
  s/color:\s*"(?:#94A3B8|#A1A1AA)"/color: "var(--text-muted, #94A3B8)"/g;
  s/color:\s*"(?:#EF4444|#DC2626|#B91C1C)"/color: "var(--error, #DC2626)"/g;
  s/color:\s*"(?:#10B981|#059669|#047857)"/color: "var(--success, #059669)"/g;
  s/color:\s*"(?:#F59E0B|#D97706|#B45309)"/color: "var(--warning, #D97706)"/g;
  
  s/borderColor:\s*"(?:#E2E8F0|#CBD5E1)"/borderColor: "var(--border, #E2E8F0)"/g;
  s/border:\s*"1px solid (?:#E2E8F0|#CBD5E1)"/border: "1px solid var(--border, #E2E8F0)"/g;
  s/borderBottom:\s*"1px solid (?:#E2E8F0|#CBD5E1)"/borderBottom: "1px solid var(--border, #E2E8F0)"/g;
  s/borderTop:\s*"1px solid (?:#E2E8F0|#CBD5E1)"/borderTop: "1px solid var(--border, #E2E8F0)"/g;
  s/borderLeft:\s*"1px solid (?:#E2E8F0|#CBD5E1)"/borderLeft: "1px solid var(--border, #E2E8F0)"/g;
  s/borderRight:\s*"1px solid (?:#E2E8F0|#CBD5E1)"/borderRight: "1px solid var(--border, #E2E8F0)"/g;
'
