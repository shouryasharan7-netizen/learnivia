#!/bin/bash
find src/app/admin -type f \( -name "*.tsx" -o -name "*.module.css" \) | xargs perl -pi -e '
  s/color: "#0F172A"/color: "var(--text-primary, #0C1B33)"/g;
  s/background: "#111827"/background: "var(--text-primary, #111827)"/g;
'
