"use client";

interface DataAgeChipProps {
  referenceYear: number;
}

function classify(referenceYear: number) {
  const now = new Date().getFullYear();
  const age = now - referenceYear;
  if (age <= 2) {
    return { color: "#14532D", bg: "#DCFCE7", border: "#86EFAC", age, tier: "green" as const };
  }
  if (age <= 5) {
    return { color: "#78350F", bg: "#FEF3C7", border: "#FCD34D", age, tier: "amber" as const };
  }
  return { color: "#7F1D1D", bg: "#FEE2E2", border: "#FCA5A5", age, tier: "red" as const };
}

export default function DataAgeChip({ referenceYear }: DataAgeChipProps) {
  const { color, bg, border, age, tier } = classify(referenceYear);
  const tooltip =
    tier === "red"
      ? "Census 2027 fieldwork has begun — refreshed figures expected on this platform within 90 days of official release."
      : undefined;

  return (
    <span
      title={tooltip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {age}y old
    </span>
  );
}
