/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Infrastructure Tracker — news-driven timeline model.
 * Every data point links to a news article. The platform presents
 * facts aggregated from the press, never judgment.
 */

"use client";
import ModuleErrorBoundary from "@/components/common/ModuleErrorBoundary";
import { use, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HardHat, AlertTriangle, Building2, ExternalLink, ChevronDown, ChevronUp, Info, Sparkles } from "lucide-react";
import { useInfrastructure } from "@/hooks/useRealtimeData";
import type { InfraProject, InfraUpdate } from "@/hooks/useRealtimeData";
import {
  ModuleHeader, LoadingShell, ErrorBlock, EmptyBlock, LastUpdatedBadge,
} from "@/components/district/ui";
import AIInsightCard from "@/components/common/AIInsightCard";
import DataSourceBanner from "@/components/common/DataSourceBanner";
import { getModuleSources } from "@/lib/constants/state-config";
import ModuleNews from "@/components/district/ModuleNews";

// ═══════════════════════════════════════════════════════════
// Config
// ═══════════════════════════════════════════════════════════

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  // Legacy lowercase
  completed:          { bg: "#F0FDF4", color: "#16A34A", border: "#86EFAC", label: "Completed" },
  ongoing:            { bg: "#FFF7ED", color: "#D97706", border: "#FDBA74", label: "Ongoing" },
  "in-progress":      { bg: "#FFF7ED", color: "#D97706", border: "#FDBA74", label: "In Progress" },
  planned:            { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", label: "Planned" },
  delayed:            { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5", label: "Delayed" },
  tendered:           { bg: "#F5F3FF", color: "#7C3AED", border: "#C4B5FD", label: "Tendered" },
  cancelled:          { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", label: "Cancelled" },
  // News-driven uppercase
  PROPOSED:           { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", label: "Proposed" },
  APPROVED:           { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", label: "Approved" },
  TENDER_ISSUED:      { bg: "#F5F3FF", color: "#7C3AED", border: "#C4B5FD", label: "Tender Issued" },
  UNDER_CONSTRUCTION: { bg: "#FFF7ED", color: "#D97706", border: "#FDBA74", label: "Under Construction" },
  ON_TRACK:           { bg: "#F0FDF4", color: "#16A34A", border: "#86EFAC", label: "On Track" },
  DELAYED:            { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5", label: "Delayed" },
  STALLED:            { bg: "#FEF2F2", color: "#B91C1C", border: "#FCA5A5", label: "Stalled" },
  COMPLETED:          { bg: "#F0FDF4", color: "#16A34A", border: "#86EFAC", label: "Completed" },
  CANCELLED:          { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", label: "Cancelled" },
};

const CATEGORY_ICON: Record<string, string> = {
  ROAD: "🛣️", METRO: "🚇", RAIL: "🚆", BRIDGE: "🌉", FLYOVER: "🌁",
  WATER: "💧", SEWAGE: "🛁", HOUSING: "🏠", PORT: "⚓", AIRPORT: "✈️",
  POWER: "⚡", TELECOM: "📡", HOSPITAL: "🏥", SCHOOL: "🏫",
};

const UPDATE_TYPE_LABEL: Record<string, string> = {
  ANNOUNCEMENT: "Announcement", APPROVAL: "Approval", TENDER: "Tender",
  CONSTRUCTION_START: "Construction Start", BUDGET_INCREASE: "Budget Increase",
  BUDGET_DECREASE: "Budget Decrease", DELAY: "Delay", STALL: "Stall",
  PROGRESS_UPDATE: "Progress Update", CONTROVERSY: "Concern Raised",
  COMPLETION: "Completion", CANCELLATION: "Cancellation",
  PHASE_COMPLETE: "Phase Complete", INAUGURATION: "Inauguration",
  REVIEW: "Review", SEED: "Initial Record",
};

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════

function statusStyle(s: string) {
  return STATUS_STYLE[s] ?? STATUS_STYLE.PROPOSED;
}

function formatINR(rupees: number | null | undefined): string {
  if (rupees == null) return "—";
  if (rupees >= 1_00_00_00_00_000) return `₹${(rupees / 1_00_00_00_00_000).toFixed(2)} Lakh Cr`;
  if (rupees >= 10_00_00_000) return `₹${(rupees / 10_00_00_000).toFixed(0)} Cr`;
  if (rupees >= 1_00_000) return `₹${(rupees / 1_00_000).toFixed(0)} Lakh`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

function formatFullDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

function isCancelled(p: InfraProject): boolean {
  return p.status === "CANCELLED" || p.status === "cancelled";
}

function isCompleted(p: InfraProject): boolean {
  return p.status === "COMPLETED" || p.status === "completed";
}

function isDelayed(p: InfraProject): boolean {
  return p.status === "DELAYED" || p.status === "delayed" || p.status === "STALLED" || (p.delayMonths ?? 0) > 0;
}

function isActive(p: InfraProject): boolean {
  return !isCancelled(p) && !isCompleted(p);
}

// ═══════════════════════════════════════════════════════════
// Disclaimer banner — MANDATORY, at the top
// ═══════════════════════════════════════════════════════════

function DisclaimerBanner() {
  return (
    <div
      role="note"
      style={{
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        borderLeft: "4px solid #D97706",
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 20,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Info size={16} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.55 }}>
        <strong style={{ fontWeight: 700 }}>Data Transparency Notice:</strong>{" "}
        Infrastructure project data on this page is aggregated from publicly available news
        articles and government press releases. ForThePeople.in does not independently
        verify construction progress or budget figures. Each data point is linked to its
        source article. For official project status, contact the executing agency directly.
        This is not an official government tracker.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Timeline accordion (lazy)
// ═══════════════════════════════════════════════════════════

function TimelineEntry({ u }: { u: InfraUpdate }) {
  const type = UPDATE_TYPE_LABEL[u.updateType] ?? u.updateType;
  const accent = u.updateType.startsWith("BUDGET") ? "#D97706"
    : u.updateType === "DELAY" || u.updateType === "STALL" || u.updateType === "CANCELLATION" ? "#DC2626"
    : u.updateType === "COMPLETION" || u.updateType === "PHASE_COMPLETE" || u.updateType === "INAUGURATION" ? "#16A34A"
    : u.updateType === "CONTROVERSY" ? "#B45309"
    : "#2563EB";

  return (
    <div
      style={{
        position: "relative",
        padding: "12px 0 12px 22px",
        borderLeft: "2px solid #E8E8E4",
        marginLeft: 6,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: -7,
          top: 16,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: accent,
          border: "2px solid #FFF",
          boxShadow: `0 0 0 2px ${accent}40`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-mono)" }}>
          {formatFullDate(u.date)}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 10,
            background: `${accent}15`,
            color: accent,
            textTransform: "uppercase",
          }}
        >
          {type}
        </span>
        {u.verified && (
          <span
            title="Verified by the news-extraction AI verifier"
            style={{ fontSize: 10, color: "#16A34A", fontWeight: 600 }}
          >
            ✓ verified
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500, marginBottom: 4, lineHeight: 1.4 }}>
        {u.headline}
      </div>
      {u.summary && u.summary !== u.headline && (
        <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 6, lineHeight: 1.5 }}>{u.summary}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: "#6B7280" }}>
        {u.personName && (
          <span>
            👤 {u.personName}
            {u.personRole ? ` — ${u.personRole}` : ""}
            {u.personParty ? ` (${u.personParty})` : ""}
          </span>
        )}
        {u.progressPct != null && <span>📊 {u.progressPct}% complete</span>}
        {u.budgetChange != null && <span>💰 {formatINR(u.budgetChange)}</span>}
        {u.statusChange && <span>↪ {statusStyle(u.statusChange).label}</span>}
      </div>
      <a
        href={u.newsUrl.startsWith("http") ? u.newsUrl : `https://${u.newsUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginTop: 6,
          fontSize: 11,
          color: "#2563EB",
          textDecoration: "none",
        }}
      >
        {u.newsSource ?? "Source"} {u.newsTitle ? `· ${u.newsTitle.slice(0, 80)}${u.newsTitle.length > 80 ? "…" : ""}` : ""}
        <ExternalLink size={10} />
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Lazy AI analysis (Gemini 2.5 Pro, 24h cached by endpoint)
// ═══════════════════════════════════════════════════════════

interface InfraAnalysis {
  citizenImpact: string[];
  accountability: string[];
  notes: string;
  sources: number;
  generatedAt: string;
  cached: boolean;
}

function LazyAnalysis({ projectId }: { projectId: string }) {
  const [enabled, setEnabled] = useState(false);
  const { data, isFetching, error } = useQuery<InfraAnalysis>({
    queryKey: ["infra-analysis", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/data/infra-analysis?projectId=${projectId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    enabled,
    staleTime: 60 * 60_000,
  });

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          background: "#F5F3FF",
          color: "#6D28D9",
          border: "1px solid #DDD6FE",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Sparkles size={13} /> Generate project analysis
      </button>
    );
  }

  if (isFetching) {
    return (
      <div style={{ padding: "12px 16px", background: "#F5F5F0", borderRadius: 10, fontSize: 13, color: "#6B7280" }}>
        Generating neutral project analysis (Gemini 2.5 Pro)…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, fontSize: 12, color: "#B91C1C" }}>
        Analysis failed. Try again later.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "14px 16px",
        background: "#FAFAFE",
        border: "1px solid #E0E7FF",
        borderLeft: "4px solid #7C3AED",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Sparkles size={13} style={{ color: "#7C3AED" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#4C1D95", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Project Analysis {data.cached ? "· cached" : ""}
        </span>
      </div>
      {data.citizenImpact?.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            📊 For Citizens
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
            {data.citizenImpact.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}
      {data.accountability?.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            📊 For Accountability
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
            {data.accountability.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}
      {data.notes && (
        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5, fontStyle: "italic" }}>{data.notes}</div>
      )}
      <div style={{ marginTop: 8, fontSize: 10, color: "#9B9B9B" }}>
        Source: {data.sources} news articles · Generated by Gemini 2.5 Pro · ForThePeople.in
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Project card
// ═══════════════════════════════════════════════════════════

function ProjectCard({ p }: { p: InfraProject }) {
  const [open, setOpen] = useState(false);
  const ss = statusStyle(p.status);
  const icon = CATEGORY_ICON[p.category] ?? "🔧";
  const updates = p.updates ?? [];
  const latest = updates[0];
  const progress = p.progressPct ?? 0;
  const hasBudgetOverrun = p.costOverrun != null && p.costOverrun !== 0;
  const verifiedCount = p.verificationCount ?? 0;

  return (
    <div
      style={{
        background: "#FFF",
        border: "1px solid #E8E8E4",
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, marginBottom: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
            <span>{p.name}</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span>{p.category}</span>
            {p.executingAgency && <><span>·</span><span>Executing: {p.executingAgency}</span></>}
            {p.scope && p.scope !== "DISTRICT" && <><span>·</span><span>{p.scope}</span></>}
          </div>
        </div>
        <span
          style={{
            fontSize: 11, fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            background: ss.bg, color: ss.color,
            border: `1px solid ${ss.border}`,
            whiteSpace: "nowrap",
          }}
        >
          {ss.label}
          {isDelayed(p) && " ⚠"}
        </span>
      </div>

      {/* Announcement attribution */}
      {(p.announcedBy || p.announcedDate) && (
        <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 6 }}>
          👤 Announced by:{" "}
          <strong style={{ color: "#1A1A1A" }}>{p.announcedBy ?? "—"}</strong>
          {p.announcedByRole ? ` (${p.announcedByRole})` : ""}
          {p.party ? `, ${p.party}` : ""}
          {p.announcedDate && <> · {formatMonthYear(p.announcedDate)}</>}
        </div>
      )}

      {/* Key people */}
      {p.keyPeople && p.keyPeople.length > 0 && (
        <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 10 }}>
          🏗 Key people: {p.keyPeople.slice(0, 3).map((kp, i) => (
            <span key={i}>
              {i > 0 ? ", " : ""}
              <strong style={{ color: "#1A1A1A" }}>{kp.name}</strong>
              {kp.role ? ` (${kp.role}${kp.party ? `, ${kp.party}` : ""})` : kp.party ? ` (${kp.party})` : ""}
            </span>
          ))}
          {p.keyPeople.length > 3 && <span> + {p.keyPeople.length - 3} more</span>}
        </div>
      )}

      {/* Budget */}
      {(p.originalBudget != null || p.budget != null) && (
        <div style={{ background: "#F9FAFB", border: "1px solid #F0F0EC", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "#9B9B9B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Budget</div>
          <div style={{ fontSize: 13, color: "#1A1A1A", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <span>Original: <strong>{formatINR(p.originalBudget ?? p.budget)}</strong></span>
            {p.revisedBudget != null && p.revisedBudget !== p.originalBudget && (
              <>
                <span style={{ color: "#9B9B9B" }}>→</span>
                <span>Revised: <strong>{formatINR(p.revisedBudget)}</strong></span>
              </>
            )}
            {hasBudgetOverrun && p.costOverrun != null && (
              <span style={{ fontSize: 11, color: p.costOverrun > 0 ? "#B45309" : "#16A34A" }}>
                ({p.costOverrun > 0 ? "+" : ""}{formatINR(Math.abs(p.costOverrun))}
                {p.costOverrunPct != null ? ` / ${p.costOverrun > 0 ? "+" : ""}${p.costOverrunPct.toFixed(0)}%` : ""})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {(p.actualStartDate || p.startDate || p.originalEndDate || p.expectedEnd || p.revisedEndDate) && (
        <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 10 }}>
          📅 Started: <strong>{formatMonthYear(p.actualStartDate ?? p.startDate)}</strong>
          {(p.originalEndDate ?? p.expectedEnd) && (
            <> · Expected: <strong>{formatMonthYear(p.originalEndDate ?? p.expectedEnd)}</strong></>
          )}
          {p.revisedEndDate && (
            <> · <span style={{ color: "#B45309" }}>Revised: {formatMonthYear(p.revisedEndDate)}
              {p.delayMonths ? ` (+${p.delayMonths} months)` : ""}
            </span></>
          )}
          {isCancelled(p) && p.cancelledDate && (
            <> · <span style={{ color: "#B91C1C" }}>Cancelled: {formatMonthYear(p.cancelledDate)}</span></>
          )}
        </div>
      )}

      {/* Progress bar */}
      {!isCancelled(p) && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
            <span>Progress</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#1A1A1A" }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "#F0F0EC", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(100, progress)}%`,
                height: "100%",
                background: progress >= 75 ? "#16A34A" : progress >= 40 ? "#D97706" : "#2563EB",
                transition: "width 500ms ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Cancellation reason */}
      {isCancelled(p) && p.cancellationReason && (
        <div style={{ fontSize: 12, color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
          <strong>Cancellation reason:</strong> {p.cancellationReason}
        </div>
      )}

      {/* Latest news */}
      {latest && (
        <div style={{ fontSize: 12, color: "#374151", background: "#FAFAF8", border: "1px solid #F0F0EC", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>📰 Latest:</span>
            <span style={{ fontSize: 10, color: "#9B9B9B" }}>{formatFullDate(latest.date)}</span>
          </div>
          <a
            href={latest.newsUrl.startsWith("http") ? latest.newsUrl : `https://${latest.newsUrl}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: 500 }}
          >
            {latest.headline}
            {latest.newsSource && <span style={{ color: "#9B9B9B", fontWeight: 400 }}> — {latest.newsSource}</span>}
          </a>
        </div>
      )}

      {/* Verification count + source caveat */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#6B7280", marginBottom: 10 }}>
        <span>
          {verifiedCount > 0 ? `✅ Verified by ${verifiedCount} news source${verifiedCount !== 1 ? "s" : ""}` : ""}
          {verifiedCount === 1 && <span style={{ color: "#B45309", marginLeft: 6 }}>⚠ Single source — awaiting additional verification</span>}
        </span>
        {p.lastNewsAt && <span>Last news: {formatFullDate(p.lastNewsAt)}</span>}
      </div>

      {/* Timeline toggle */}
      {updates.length > 0 && (
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            background: "#EFF6FF",
            color: "#2563EB",
            border: "1px solid #BFDBFE",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
          aria-expanded={open}
        >
          {open ? <>Hide Timeline <ChevronUp size={13} /></> : <>View Full Timeline ({updates.length}) <ChevronDown size={13} /></>}
        </button>
      )}

      {open && updates.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
          {updates.map((u) => <TimelineEntry key={u.id} u={u} />)}
          <div style={{ marginTop: 12 }}>
            <LazyAnalysis projectId={p.id} />
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: "#9B9B9B", lineHeight: 1.5 }}>
            Data sourced from news articles. Not independently verified. Contact
            {" "}{p.executingAgency ?? "the executing agency"} for official status.
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Inner page
// ═══════════════════════════════════════════════════════════

type CategoryFilter = "all" | string;
type StatusFilter = "all" | "active" | "delayed" | "completed" | "cancelled";
type SortOption = "latest" | "budget" | "progress" | "delay";

function InfrastructurePageInner({ params }: { params: Promise<{ locale: string; state: string; district: string }> }) {
  const { locale, state, district } = use(params);
  const base = `/${locale}/${state}/${district}`;
  const { data, isLoading, error } = useInfrastructure(district, state);
  const projects = useMemo<InfraProject[]>(() => data?.data ?? [], [data]);

  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const activeList = projects.filter((p) => !isCancelled(p));
  const cancelledList = projects.filter((p) => isCancelled(p));

  const totalBudget = activeList.reduce((s, p) => s + (p.revisedBudget ?? p.originalBudget ?? p.budget ?? 0), 0);
  const totalSpent = activeList.reduce((s, p) => s + (p.fundsReleased ?? 0), 0);
  const counts = {
    total: projects.length,
    active: activeList.filter(isActive).length,
    completed: projects.filter(isCompleted).length,
    delayed: projects.filter(isDelayed).length,
    cancelled: cancelledList.length,
  };

  const filtered = useMemo(() => {
    const list = activeList.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (statusFilter === "active" && !isActive(p)) return false;
      if (statusFilter === "delayed" && !isDelayed(p)) return false;
      if (statusFilter === "completed" && !isCompleted(p)) return false;
      return true;
    });
    const sorted = [...list];
    if (sortBy === "latest") sorted.sort((a, b) => {
      const at = a.lastNewsAt ? new Date(a.lastNewsAt).getTime() : 0;
      const bt = b.lastNewsAt ? new Date(b.lastNewsAt).getTime() : 0;
      return bt - at;
    });
    if (sortBy === "budget") sorted.sort((a, b) => (b.revisedBudget ?? b.budget ?? 0) - (a.revisedBudget ?? a.budget ?? 0));
    if (sortBy === "progress") sorted.sort((a, b) => (b.progressPct ?? 0) - (a.progressPct ?? 0));
    if (sortBy === "delay") sorted.sort((a, b) => (b.delayMonths ?? 0) - (a.delayMonths ?? 0));
    return sorted;
  }, [activeList, catFilter, statusFilter, sortBy]);

  return (
    <div style={{ padding: 24 }}>
      <ModuleHeader
        icon={HardHat}
        title="Infrastructure Tracker"
        description="Government projects tracked through news — every fact linked to its source"
        backHref={base}
      >
        <LastUpdatedBadge lastUpdated={data?.meta?.lastUpdated} />
      </ModuleHeader>

      <DisclaimerBanner />

      {(() => { const _src = getModuleSources("infrastructure", state); return <DataSourceBanner moduleName="infrastructure" sources={_src.sources} updateFrequency={_src.frequency} isLive={_src.isLive} />; })()}
      <AIInsightCard module="infrastructure" district={district} />

      {isLoading && <LoadingShell rows={4} />}
      {error && <ErrorBlock />}
      {!isLoading && !error && projects.length === 0 && (
        <EmptyBlock icon="🔧" message="No infrastructure projects tracked yet. News-driven updates will populate this page automatically." />
      )}

      {!isLoading && projects.length > 0 && (
        <>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
            <StatTile label="Total Projects" value={counts.total} />
            <StatTile label="Active" value={counts.active} color="#D97706" />
            <StatTile label="Completed" value={counts.completed} color="#16A34A" />
            <StatTile label="Delayed" value={counts.delayed} color="#DC2626" />
            <StatTile label="Cancelled" value={counts.cancelled} color="#6B7280" />
            <StatTile label="Total Budget" value={formatINR(totalBudget)} />
            {totalSpent > 0 && <StatTile label="Funds Released" value={formatINR(totalSpent)} color="#2563EB" />}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
            <FilterRow
              label="Category"
              options={categories.map((c) => ({ id: c, label: c === "all" ? "All" : c.charAt(0) + c.slice(1).toLowerCase(), count: c === "all" ? projects.length : projects.filter((p) => p.category === c).length }))}
              value={catFilter}
              onChange={(v) => setCatFilter(v as CategoryFilter)}
            />
            <FilterRow
              label="Status"
              options={[
                { id: "all", label: "All", count: projects.length },
                { id: "active", label: "Active", count: counts.active },
                { id: "delayed", label: "Delayed", count: counts.delayed },
                { id: "completed", label: "Completed", count: counts.completed },
              ]}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
            />
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#9B9B9B", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{ padding: "4px 10px", border: "1px solid #E8E8E4", borderRadius: 8, fontSize: 12, background: "#FFF" }}
              >
                <option value="latest">Latest Update</option>
                <option value="budget">Budget (highest)</option>
                <option value="progress">Most Complete</option>
                <option value="delay">Most Delayed</option>
              </select>
            </div>
          </div>

          {/* Active cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14, marginBottom: 28 }}>
            {filtered.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>

          {/* Cancelled section */}
          {cancelledList.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={16} style={{ color: "#6B7280" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Cancelled / Shelved Projects ({cancelledList.length})
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14, marginBottom: 28 }}>
                {cancelledList.map((p) => <ProjectCard key={p.id} p={p} />)}
              </div>
            </div>
          )}
        </>
      )}

      <ModuleNews district={district} state={state} locale={locale} module="infrastructure" />
    </div>
  );
}

function StatTile({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{ background: "#FFF", border: "1px solid #E8E8E4", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, color: "#9B9B9B", marginBottom: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: color ?? "#1A1A1A" }}>{value}</div>
    </div>
  );
}

function FilterRow({
  label, options, value, onChange,
}: {
  label: string;
  options: Array<{ id: string; label: string; count: number }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10, color: "#9B9B9B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 20,
                background: active ? "#2563EB" : "#F5F5F0",
                color: active ? "#FFF" : "#6B6B6B",
                border: active ? "1px solid #2563EB" : "1px solid #E8E8E4",
                cursor: "pointer",
              }}
            >
              {o.label} ({o.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function InfrastructurePage({ params }: { params: Promise<{ locale: string; state: string; district: string }> }) {
  return (
    <ModuleErrorBoundary moduleName="Infrastructure">
      <InfrastructurePageInner params={params} />
    </ModuleErrorBoundary>
  );
}

// Keep Building2 imported to avoid an unused-import lint if removed later
void Building2;
