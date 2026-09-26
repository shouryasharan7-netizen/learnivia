#!/bin/bash
find src/app/admin -type f \( -name "*.tsx" -o -name "*.module.css" \) | xargs perl -pi -e '
  s/--error-light/--error-bg/g;
  s/--success-light/--success-bg/g;
  s/--warning-light/--warning-bg/g;
  s/--info-light/--primary-subtle/g;
  s/--warning-dark/--warning/g;
  s/--error-dark/--error/g;
'
