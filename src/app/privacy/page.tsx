/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * DPDP Act 2023 Compliant Privacy Policy
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ForThePeople.in",
  description: "How ForThePeople.in handles your data. DPDP Act 2023 compliant.",
  alternates: { canonical: "https://forthepeople.in/privacy" },
};

const section: React.CSSProperties = { marginBottom: 32 };
const h2Style: React.CSSProperties = {
  fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 12, marginTop: 0,
};
const pStyle: React.CSSProperties = { fontSize: 14, color: "#3A3A3A", lineHeight: 1.7, margin: "0 0 10px" };
const tableStyle: React.CSSProperties = {
  width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12,
};
const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "8px 10px", background: "#F5F5F0",
  fontWeight: 600, color: "#1A1A1A", borderBottom: "1px solid #E8E8E4",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px", borderBottom: "1px solid #F0F0EC", color: "#3A3A3A",
  verticalAlign: "top",
};

export default function PrivacyPage() {
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none" }}>
            &larr; Back to ForThePeople.in
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", margin: "16px 0 4px" }}>
            Privacy Policy
          </h1>
          <div style={{ fontSize: 12, color: "#9B9B9B" }}>Last updated: April 2026</div>
        </div>

        {/* 1. About */}
        <div style={section}>
          <h2 style={h2Style}>1. About This Policy</h2>
          <p style={pStyle}>
            ForThePeople.in is an independent citizen transparency platform built by <strong>Jayanth M B</strong>.
            It is not an official government website. This policy explains how we handle your data in compliance
            with the Digital Personal Data Protection (DPDP) Act, 2023.
          </p>
          <p style={pStyle}>
            Contact: <a href="mailto:support@forthepeople.in" style={{ color: "#2563EB" }}>support@forthepeople.in</a>
          </p>
        </div>

        {/* 2. What Data We Process */}
        <div style={section}>
          <h2 style={h2Style}>2. What Data We Process</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>What Exactly</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Vote fingerprint</td>
                  <td style={tdStyle}>SHA-256 hash of IP + browser info</td>
                  <td style={tdStyle}>Prevent duplicate votes</td>
                  <td style={tdStyle}>Platform integrity</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Feedback email</td>
                  <td style={tdStyle}>Email you type in the feedback form</td>
                  <td style={tdStyle}>Respond to your feedback</td>
                  <td style={tdStyle}>Your consent</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Supporter info</td>
                  <td style={tdStyle}>Name, email, contribution amount</td>
                  <td style={tdStyle}>Process contributions</td>
                  <td style={tdStyle}>Contractual</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Payment details</td>
                  <td style={tdStyle}>Processed entirely by Razorpay</td>
                  <td style={tdStyle}>Complete payment</td>
                  <td style={tdStyle}>Contractual</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Server logs</td>
                  <td style={tdStyle}>IP address, browser type</td>
                  <td style={tdStyle}>Security &amp; abuse prevention</td>
                  <td style={tdStyle}>Legitimate interest</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. What We Do NOT Collect */}
        <div style={section}>
          <h2 style={h2Style}>3. What We Do NOT Collect</h2>
          {[
            "Aadhaar, PAN, voter ID, or any government ID",
            "Personal citizen data from government portals",
            "Cookies (we use zero cookies)",
            "Tracking pixels or third-party trackers",
            "Location data (GPS)",
          ].map((item) => (
            <p key={item} style={{ ...pStyle, margin: "0 0 6px" }}>
              <span style={{ color: "#DC2626", fontWeight: 600 }}>&#x2717;</span>{" "}{item}
            </p>
          ))}
          <p style={{ ...pStyle, marginTop: 10, fontWeight: 600 }}>
            We do NOT sell, rent, or share your data with anyone.
          </p>
        </div>

        {/* 4. Data Retention */}
        <div style={section}>
          <h2 style={h2Style}>4. Data Retention</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>How Long</th>
                  <th style={thStyle}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Feedback</td>
                  <td style={tdStyle}>12 months</td>
                  <td style={tdStyle}>Then deleted</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Vote fingerprints</td>
                  <td style={tdStyle}>While voting is active</td>
                  <td style={tdStyle}>Deleted when feature ships</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Supporter data</td>
                  <td style={tdStyle}>7 years minimum</td>
                  <td style={tdStyle}>Indian tax law</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Server logs</td>
                  <td style={tdStyle}>30 days</td>
                  <td style={tdStyle}>Vercel default</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Your Rights Under DPDP Act 2023 */}
        <div style={section}>
          <h2 style={h2Style}>5. Your Rights Under DPDP Act 2023</h2>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: "0 0 12px" }}>
            <li style={{ marginBottom: 6 }}><strong>Right to Access:</strong> Request what we hold about you</li>
            <li style={{ marginBottom: 6 }}><strong>Right to Correction:</strong> Request fixing inaccurate data</li>
            <li style={{ marginBottom: 6 }}><strong>Right to Erasure:</strong> Request deletion of your data</li>
            <li style={{ marginBottom: 6 }}>
              <strong>Right to Grievance Redressal:</strong> Email us &rarr; we respond within 30 days &rarr;
              escalate to the Data Protection Board of India if unsatisfied
            </li>
          </ul>
          <p style={pStyle}>
            <strong>How:</strong> Email{" "}
            <a href="mailto:support@forthepeople.in" style={{ color: "#2563EB" }}>support@forthepeople.in</a>
            {" "}with subject <strong>&quot;DPDP Data Request&quot;</strong>
          </p>
        </div>

        {/* 6. Children's Data */}
        <div style={section}>
          <h2 style={h2Style}>6. Children&apos;s Data</h2>
          <p style={pStyle}>
            ForThePeople.in is not targeted at children under 18. Feature voting uses anonymous
            fingerprints, not personal data. If you believe a child has provided personal data,
            contact us for immediate deletion.
          </p>
        </div>

        {/* 7. Third-Party Services */}
        <div style={section}>
          <h2 style={h2Style}>7. Third-Party Services</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Service</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Vercel</td>
                  <td style={tdStyle}>Hosting &amp; deployment</td>
                  <td style={tdStyle}><a href="https://vercel.com/legal/privacy-policy" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Razorpay</td>
                  <td style={tdStyle}>Payment processing</td>
                  <td style={tdStyle}><a href="https://razorpay.com/privacy/" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">razorpay.com/privacy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Plausible</td>
                  <td style={tdStyle}>Analytics (no personal data)</td>
                  <td style={tdStyle}><a href="https://plausible.io/data-policy" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">plausible.io/data-policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Resend</td>
                  <td style={tdStyle}>Admin emails only</td>
                  <td style={tdStyle}><a href="https://resend.com/legal/privacy-policy" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">resend.com/legal/privacy-policy</a></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Sentry</td>
                  <td style={tdStyle}>Error logs (no personal data)</td>
                  <td style={tdStyle}><a href="https://sentry.io/privacy/" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">sentry.io/privacy</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Data Security */}
        <div style={section}>
          <h2 style={h2Style}>8. Data Security</h2>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>AES-256-CBC encryption for sensitive data</li>
            <li style={{ marginBottom: 6 }}>2FA on admin panel (Google Authenticator TOTP)</li>
            <li style={{ marginBottom: 6 }}>HTTPS everywhere</li>
            <li style={{ marginBottom: 6 }}>No plaintext passwords</li>
            <li style={{ marginBottom: 6 }}>HMAC-SHA256 payment signature verification</li>
          </ul>
        </div>

        {/* 9. Updates */}
        <div style={section}>
          <h2 style={h2Style}>9. Updates to This Policy</h2>
          <p style={pStyle}>
            We may update this policy from time to time. Changes will be noted with an updated date
            at the top of this page.
          </p>
        </div>

        {/* 10. Contact */}
        <div style={section}>
          <h2 style={h2Style}>10. Contact</h2>
          <p style={pStyle}>
            Email: <a href="mailto:support@forthepeople.in" style={{ color: "#2563EB" }}>support@forthepeople.in</a>
          </p>
          <p style={pStyle}>
            Platform: <a href="https://forthepeople.in" style={{ color: "#2563EB" }}>forthepeople.in</a>
          </p>
          <p style={pStyle}>
            GitHub: <a href="https://github.com/jayanthmb14/forthepeople" style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">github.com/jayanthmb14/forthepeople</a>
          </p>
        </div>

        {/* Cross-links */}
        <div style={{ borderTop: "1px solid #E8E8E4", paddingTop: 16, fontSize: 12, color: "#9B9B9B" }}>
          See also: <Link href="/disclaimer" style={{ color: "#2563EB", textDecoration: "none" }}>Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
