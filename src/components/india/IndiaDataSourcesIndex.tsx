/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Data Sources Index — alphabetical table of every portal cited on
 * /[locale]/india. Lives at the very bottom of the page.
 *
 * Built from the union of getAllSources() (the curated registry) and
 * the actual sources referenced by INDIA_MODULES. Sources used by at
 * least one live module are listed first; unused-by-live sources are
 * still listed but marked dim.
 *
 * Per file 31 §9 item 14.
 */

import Link from "next/link";
import {
  INDIA_MODULES,
  type IndiaModuleDef,
} from "@/lib/india/india-modules";
import { getAllSources } from "@/lib/india/india-sources";
import { INDIA_DESIGN } from "@/lib/india/india-design";

interface Props {
  title: string;
  subtitle: string;
}

export default function IndiaDataSourcesIndex({ title, subtitle }: Props) {
  const allSources = getAllSources();

  // For each source, find which modules cite it (display the first module's
  // refresh cadence as the canonical refresh shown in the table).
  const usage = new Map<string, { modules: IndiaModuleDef[]; refresh: string }>();
  for (const mod of INDIA_MODULES) {
    for (const s of mod.sources) {
      const entry = usage.get(s.sourceKey);
      if (entry) {
        entry.modules.push(mod);
      } else {
        usage.set(s.sourceKey, { modules: [mod], refresh: s.refresh });
      }
    }
  }

  return (
    <section
      style={{
        padding: "32px 16px 40px",
        borderTop: `1px solid ${INDIA_DESIGN.border}`,
        background: INDIA_DESIGN.bgPage,
      }}
    >
      <div
        style={{
          maxWidth: INDIA_DESIGN.sectionMaxWidth,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: INDIA_DESIGN.textFaint,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontSize: 13,
            color: INDIA_DESIGN.textMuted,
            lineHeight: 1.5,
            margin: "0 0 16px",
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            background: INDIA_DESIGN.bgCard,
            border: `1px solid ${INDIA_DESIGN.border}`,
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              minWidth: 720,
            }}
          >
            <thead>
              <tr
                style={{
                  background: INDIA_DESIGN.bgMuted,
                  textAlign: "left",
                  color: INDIA_DESIGN.textFaint,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                <th style={th()}>Source</th>
                <th style={th()}>Type</th>
                <th style={th()}>Used by</th>
                <th style={th()}>Refresh</th>
              </tr>
            </thead>
            <tbody>
              {allSources.map((src) => {
                const u = usage.get(src.key);
                const used = (u?.modules.length ?? 0) > 0;
                return (
                  <tr
                    key={src.key}
                    style={{
                      borderTop: `1px solid ${INDIA_DESIGN.border}`,
                      opacity: used ? 1 : 0.6,
                    }}
                  >
                    <td style={td()}>
                      <Link
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: INDIA_DESIGN.accentBlue,
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        {src.name}
                      </Link>
                      {src.blurb ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: INDIA_DESIGN.textFaint,
                            marginTop: 2,
                            lineHeight: 1.4,
                          }}
                        >
                          {src.blurb}
                        </div>
                      ) : null}
                    </td>
                    <td style={td()}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 10,
                          background: domainBg(src.domain),
                          color: domainText(src.domain),
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {src.domain}
                      </span>
                    </td>
                    <td style={td()}>
                      {u ? (
                        <span style={{ color: INDIA_DESIGN.textMuted }}>
                          {u.modules.length} module{u.modules.length === 1 ? "" : "s"}
                        </span>
                      ) : (
                        <span style={{ color: INDIA_DESIGN.textFaint }}>—</span>
                      )}
                    </td>
                    <td style={td()}>
                      {u?.refresh ?? <span style={{ color: INDIA_DESIGN.textFaint }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function th(): React.CSSProperties {
  return { padding: "10px 14px", whiteSpace: "nowrap" };
}

function td(): React.CSSProperties {
  return {
    padding: "10px 14px",
    color: INDIA_DESIGN.textPrimary,
    verticalAlign: "top",
  };
}

function domainBg(domain: string): string {
  switch (domain) {
    case "ministry":
      return "#EFF6FF";
    case "regulator":
      return "#F3F4F6";
    case "research":
      return "#ECFDF5";
    case "ndsap":
      return "#FFF4E6";
    case "institutional":
      return "#F5F3FF";
    default:
      return "#F8FAFC";
  }
}

function domainText(domain: string): string {
  switch (domain) {
    case "ministry":
      return "#1D4ED8";
    case "regulator":
      return "#374151";
    case "research":
      return "#15803D";
    case "ndsap":
      return "#B45309";
    case "institutional":
      return "#6D28D9";
    default:
      return "#6B7280";
  }
}
