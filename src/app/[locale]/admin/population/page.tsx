/**
 * ForThePeople.in — Admin Population Data Audit
 *
 * Read-only per-district completeness grid for demographic profiles.
 * Auth: inherited from admin layout (ftp_admin_v1 cookie).
 */

"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Users, Download } from "lucide-react";
import {
  ModuleHeader,
  StatCard,
  SectionLabel,
  LoadingShell,
  ErrorBlock,
} from "@/components/district/ui";

type NFHS5Status = "data" | "placeholder" | "none";

type DistrictRow = {
  stateSlug: string;
  stateName: string;
  districtSlug: string;
  districtName: string;
  active: boolean;
  census2011: boolean;
  nfhs5: NFHS5Status;
  mpi: boolean;
  religion: boolean;
  caste: boolean;
  employment: boolean;
  education: boolean;
  migration: boolean;
  disability: boolean;
  language: boolean;
  householdAmenities: boolean;
  maritalStatus: boolean;
  economicClass: boolean;
  profiles: Array<{
    id: string;
    dataset: string;
    year: number;
    level: string;
    sourceName: string;
    sourceUrl: string | null;
    notes: string | null;
    [k: string]: unknown;
  }>;
};

type Summary = {
  totalDistricts: number;
  activeDistricts: number;
  lockedDistricts: number;
  districtsWithAnyProfile: number;
  districtsWithCensus2011: number;
  districtsWithNFHS5: number;
  districtsWithNFHS5Placeholder: number;
  districtsWithNFHS5Data: number;
  districtsWithMPI: number;
  districtsWithZeroProfiles: number;
};

type AuditResponse = { summary: Summary; districts: DistrictRow[] };

const DIMENSIONS = [
  "religion",
  "caste",
  "employment",
  "education",
  "migration",
  "disability",
  "language",
  "householdAmenities",
  "maritalStatus",
  "economicClass",
] as const;
type DimKey = (typeof DIMENSIONS)[number];

const DIM_LABELS: Record<DimKey, string> = {
  religion: "Religion",
  caste: "Caste",
  employment: "Employment",
  education: "Education",
  migration: "Migration",
  disability: "Disability",
  language: "Language",
  householdAmenities: "HH Amenities",
  maritalStatus: "Marital",
  economicClass: "Economic Class",
};

function csvEscape(s: string | number | boolean): string {
  const v = String(s);
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export default function AdminPopulationAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [data, setData] = useState<AuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/population-audit")
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then((d: AuditResponse) => {
        setData(d);
        setIsLoading(false);
      })
      .catch((e) => {
        setErr(typeof e === "string" ? e : "Failed to load audit data");
        setIsLoading(false);
      });
  }, []);

  const stateOptions = useMemo(() => {
    if (!data) return [] as Array<{ slug: string; name: string }>;
    const seen = new Map<string, string>();
    for (const r of data.districts) seen.set(r.stateSlug, r.stateName);
    return Array.from(seen, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return data.districts.filter((r) => {
      if (selectedState !== "all" && r.stateSlug !== selectedState) return false;
      if (activeOnly && !r.active) return false;
      return true;
    });
  }, [data, selectedState, activeOnly]);

  const toggleRow = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const exportCSV = () => {
    const headers = [
      "State",
      "District",
      "Active",
      "Census 2011",
      "NFHS-5",
      "NITI MPI",
      ...DIMENSIONS.map((d) => DIM_LABELS[d]),
    ];
    const lines = [headers.join(",")];
    for (const r of filteredRows) {
      lines.push(
        [
          r.stateName,
          r.districtName,
          r.active ? "Y" : "N",
          r.census2011 ? "Y" : "N",
          r.nfhs5,
          r.mpi ? "Y" : "N",
          ...DIMENSIONS.map((d) => (r[d] ? "Y" : "N")),
        ]
          .map(csvEscape)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `population-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const s = data?.summary;

  return (
    <div style={{ padding: 24 }}>
      <ModuleHeader
        icon={Users}
        title="Population Data Audit"
        description="Per-district completeness grid for demographic profiles."
        backHref={`/${locale}/admin`}
      />

      {isLoading && <LoadingShell rows={6} />}
      {err && <ErrorBlock message={err} />}

      {s && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <StatCard label="Total districts" value={s.totalDistricts} icon={Users} />
            <StatCard label="Active" value={s.activeDistricts} accent="#16A34A" />
            <StatCard label="Locked" value={s.lockedDistricts} />
            <StatCard label="Any profile" value={s.districtsWithAnyProfile} />
            <StatCard label="Census 2011" value={s.districtsWithCensus2011} />
            <StatCard label="NFHS-5 data" value={s.districtsWithNFHS5Data} />
            <StatCard
              label="NFHS-5 placeholder"
              value={s.districtsWithNFHS5Placeholder}
              accent="#D97706"
            />
            <StatCard
              label="Zero profiles"
              value={s.districtsWithZeroProfiles}
              accent={s.districtsWithZeroProfiles > 0 ? "#DC2626" : undefined}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              padding: "10px 14px",
              background: "#FFF",
              border: "1px solid #E8E8E4",
              borderRadius: 10,
            }}
          >
            <label style={{ fontSize: 12, color: "#6B6B6B" }}>
              State:{" "}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #E8E8E4",
                  borderRadius: 6,
                  fontSize: 13,
                  background: "#FFF",
                  marginLeft: 6,
                }}
              >
                <option value="all">All states</option>
                {stateOptions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                fontSize: 12,
                color: "#6B6B6B",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
              />
              Active districts only
            </label>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: "#9B9B9B" }}>
              Showing {filteredRows.length} of {data.districts.length}
            </span>
            <button
              type="button"
              onClick={exportCSV}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: "#2563EB",
                color: "#FFF",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>

          <SectionLabel>Completeness grid</SectionLabel>
          <div
            style={{
              background: "#FFF",
              border: "1px solid #E8E8E4",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 1100,
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#F9F9F6",
                    zIndex: 2,
                  }}
                >
                  <tr>
                    <Th>District</Th>
                    <Th>Active</Th>
                    <Th>Census 2011</Th>
                    <Th>NFHS-5</Th>
                    <Th>NITI MPI</Th>
                    {DIMENSIONS.map((d) => (
                      <Th key={d}>{DIM_LABELS[d]}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r, i) => {
                    const key = `${r.stateSlug}/${r.districtSlug}`;
                    const isOpen = expanded.has(key);
                    return (
                      <ExpandableRow
                        key={key}
                        row={r}
                        rowKey={key}
                        isOpen={isOpen}
                        onToggle={toggleRow}
                        zebra={i % 2 === 0}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredRows.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 12px",
                  fontSize: 13,
                  color: "#9B9B9B",
                }}
              >
                No districts match the current filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 8px",
        borderBottom: "1px solid #E8E8E4",
        fontWeight: 600,
        color: "#4B4B4B",
        fontSize: 11,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Mark({ v }: { v: boolean }) {
  return (
    <span style={{ color: v ? "#16A34A" : "#D1D5DB", fontWeight: 600 }}>
      {v ? "✓" : "—"}
    </span>
  );
}

function NFHS5Mark({ s }: { s: NFHS5Status }) {
  if (s === "data") return <span style={{ color: "#16A34A", fontWeight: 600 }}>✓</span>;
  if (s === "placeholder")
    return (
      <span title="Row exists with placeholder/null data — pending real NFHS-5 load" style={{ color: "#D97706", fontWeight: 600 }}>
        ⏳
      </span>
    );
  return <span style={{ color: "#D1D5DB", fontWeight: 600 }}>—</span>;
}

function ExpandableRow({
  row,
  rowKey,
  isOpen,
  onToggle,
  zebra,
}: {
  row: DistrictRow;
  rowKey: string;
  isOpen: boolean;
  onToggle: (k: string) => void;
  zebra: boolean;
}) {
  const bg = zebra ? "#FAFAF8" : "#FFFFFF";
  const cellStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom: "1px solid #F0F0EC",
    color: "#4B4B4B",
    verticalAlign: "top",
  };

  return (
    <>
      <tr
        onClick={() => onToggle(rowKey)}
        style={{ background: bg, cursor: "pointer" }}
      >
        <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
          <span style={{ color: "#9B9B9B" }}>{row.stateName}</span> ·{" "}
          <strong style={{ color: "#1A1A1A" }}>{row.districtName}</strong>
          <span style={{ color: "#9B9B9B", marginLeft: 6 }}>
            {isOpen ? "▾" : "▸"}
          </span>
        </td>
        <td style={cellStyle}>
          <Mark v={row.active} />
        </td>
        <td style={cellStyle}>
          <Mark v={row.census2011} />
        </td>
        <td style={cellStyle}>
          <NFHS5Mark s={row.nfhs5} />
        </td>
        <td style={cellStyle}>
          <Mark v={row.mpi} />
        </td>
        {DIMENSIONS.map((d) => (
          <td key={d} style={cellStyle}>
            <Mark v={row[d]} />
          </td>
        ))}
      </tr>
      {isOpen && (
        <tr style={{ background: bg }}>
          <td colSpan={5 + DIMENSIONS.length} style={{ padding: "0 8px 10px 24px" }}>
            <div style={{ fontSize: 11, color: "#9B9B9B", marginBottom: 6 }}>
              {row.profiles.length} profile(s) for this district
            </div>
            {row.profiles.length === 0 ? (
              <div style={{ fontSize: 12, color: "#9B9B9B", fontStyle: "italic" }}>
                No DemographicProfile rows yet.
              </div>
            ) : (
              <pre
                style={{
                  fontSize: 10,
                  background: "#FFFFFF",
                  border: "1px solid #E8E8E4",
                  borderRadius: 6,
                  padding: "8px 10px",
                  maxHeight: 320,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(row.profiles, null, 2)}
              </pre>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
