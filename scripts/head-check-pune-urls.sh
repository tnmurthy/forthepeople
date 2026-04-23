#!/usr/bin/env bash
# HEAD-check Maharashtra district portals added in Pune #10 Prompt 1.
# Reports: PASS (2xx/3xx), FAIL (4xx/5xx/network), or TIMEOUT.

set -u
URLS=(
  "ahilyanagar|https://ahilyanagar.nic.in"
  "akola|https://akola.gov.in"
  "amravati|https://amravati.gov.in"
  "chhatrapati-sambhajinagar|https://aurangabad.gov.in"
  "beed|https://beed.gov.in"
  "bhandara|https://bhandara.gov.in"
  "buldhana|https://buldhana.nic.in"
  "chandrapur|https://chanda.nic.in"
  "dharashiv|https://osmanabad.gov.in"
  "dhule|https://dhule.gov.in"
  "gadchiroli|https://gadchiroli.gov.in"
  "gondia|https://gondia.gov.in"
  "hingoli|https://hingoli.nic.in"
  "jalgaon|https://jalgaon.gov.in"
  "jalna|https://jalna.gov.in"
  "kolhapur|https://kolhapur.gov.in"
  "latur|https://latur.gov.in"
  "nanded|https://nanded.gov.in"
  "nandurbar|https://nandurbar.gov.in"
  "palghar|https://palghar.gov.in"
  "parbhani|https://parbhani.gov.in"
  "raigad|https://raigad.gov.in"
  "ratnagiri|https://ratnagiri.gov.in"
  "sangli|https://sangli.nic.in"
  "satara|https://satara.gov.in"
  "sindhudurg|https://sindhudurg.nic.in"
  "solapur|https://solapur.gov.in"
  "thane|https://thane.gov.in"
  "wardha|https://wardha.gov.in"
  "washim|https://washim.nic.in"
  "yavatmal|https://yavatmal.nic.in"
  "pune|https://pune.gov.in"
)

pass=0
fail=0
for pair in "${URLS[@]}"; do
  slug="${pair%%|*}"
  url="${pair##*|}"
  # -L follow redirects, -m 10s timeout, -o /dev/null silent body, -w just status
  code=$(curl -sIL -A "ForThePeople.in/health-check" -m 10 -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  if [[ "$code" =~ ^(2|3)[0-9][0-9]$ ]]; then
    printf "  PASS  %-30s %-45s %s\n" "$slug" "$url" "$code"
    pass=$((pass + 1))
  else
    printf "  FAIL  %-30s %-45s %s\n" "$slug" "$url" "$code"
    fail=$((fail + 1))
  fi
done

echo ""
echo "Summary: $pass passed / $fail failed (total ${#URLS[@]})"
