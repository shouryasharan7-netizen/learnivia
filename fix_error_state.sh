#!/bin/bash
perl -pi -e 's/background: "#FFFBF7"/background: "var(--warning-light, #FFFBF7)"/g' src/components/ui/ErrorState.tsx
