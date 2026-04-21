"use client";

interface EmptyBlockProps {
  icon?: string;
  message: string;
}

export default function EmptyBlock({ icon = "📊", message }: EmptyBlockProps) {
  return (
    <div
      style={{
        background: "#FAFAF8",
        border: "1px solid #E8E8E4",
        borderRadius: 10,
        padding: "20px 18px",
        color: "#6B6B6B",
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "10px 0",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
