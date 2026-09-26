#!/bin/bash
perl -pi -e '
  s/background: #fffbeb;/background: var(--warning-light, #fffbeb);/g;
  s/background: #fef2f2;/background: var(--error-light, #fef2f2);/g;
  s/background: #fffdf7;/background: var(--warning-light, #fffdf7);/g;
  s/background: #fffbfb;/background: var(--error-light, #fffbfb);/g;
  s/background: #fef3c7;/background: var(--warning-light, #fef3c7);/g;
  s/background: #fee2e2;/background: var(--error-light, #fee2e2);/g;
  s/color: #92400e;/color: var(--warning-dark, #92400e);/g;
  s/color: #991b1b;/color: var(--error-dark, #991b1b);/g;
  s/border-color: #fcd34d;/border-color: var(--warning, #fcd34d);/g;
  s/border-color: #fca5a5;/border-color: var(--error, #fca5a5);/g;
' src/app/admin/page.module.css
