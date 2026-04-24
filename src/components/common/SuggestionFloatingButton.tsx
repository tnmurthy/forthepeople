"use client";

/**
 * Site-wide floating CTA: opens a modal with the SuggestionForm.
 * Hidden on /admin routes + on /features (where the form is already in-page).
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, X } from "lucide-react";
import SuggestionForm from "@/components/features/SuggestionForm";

export default function SuggestionFloatingButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Don't render on admin pages or on the /features page itself.
  if (pathname.includes("/admin")) return null;
  if (pathname.endsWith("/features") || pathname.includes("/features?")) return null;

  return (
    <>
      <button
        aria-label="Share an idea"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 49,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          background: "#7C3AED",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MessageSquarePlus size={22} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px 26px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "#F3F4F6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>💬 Share your idea</div>
            <div style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 18 }}>
              Spot something wrong? Want a new feature? Tell us — we read every one.
            </div>
            <SuggestionForm onSuccess={() => setTimeout(() => setOpen(false), 1500)} />
          </div>
        </div>
      )}
    </>
  );
}
