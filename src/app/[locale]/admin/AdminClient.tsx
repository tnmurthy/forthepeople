"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Bell,
  Brain,
  Shield,
  CheckCircle,
  MessageSquare,
  Heart,
  TrendingUp,
} from "lucide-react";
import SystemHealth from "./SystemHealth";
import AlertsAndLogs from "./AlertsAndLogs";
import AnalyticsDashboard from "./AnalyticsDashboard";

type TabId =
  | "dashboard"
  | "system"
  | "alerts"
  | "ai"
  | "security"
  | "review"
  | "feedback"
  | "supporters"
  | "analytics";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  inline?: boolean;
  href?: string;
}

const TABS: Tab[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, inline: true },
  { id: "system", label: "System Health", icon: Activity, inline: true },
  { id: "alerts", label: "Alerts & Logs", icon: Bell, inline: true },
  { id: "ai", label: "AI Settings", icon: Brain, href: "/admin/ai-settings" },
  { id: "security", label: "Security", icon: Shield, href: "/admin/security" },
  { id: "review", label: "Review Queue", icon: CheckCircle, href: "/admin/review" },
  { id: "feedback", label: "Feedback", icon: MessageSquare, href: "/admin/feedback" },
  { id: "supporters", label: "Supporters", icon: Heart, href: "/admin/supporters" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, inline: true },
];

export default function AdminClient({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    fetch("/api/admin/alerts?read=false&limit=1")
      .then((r) => r.json())
      .then((d) => setUnreadAlerts(d.total || 0))
      .catch(() => {});
  }, [activeTab]);

  const handleTab = (tab: Tab) => {
    if (tab.inline) {
      setActiveTab(tab.id);
    } else if (tab.href) {
      router.push(`/${locale}${tab.href}`);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          marginBottom: 20,
          overflowX: "auto",
          borderBottom: "1px solid #E8E8E4",
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.inline && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#2563EB" : "#6B6B6B",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #2563EB" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginBottom: -1,
                transition: "color 150ms, border-color 150ms",
              }}
            >
              <Icon size={14} />
              {tab.label}
              {tab.id === "alerts" && unreadAlerts > 0 && (
                <span
                  style={{
                    background: "#DC2626",
                    color: "#fff",
                    borderRadius: 20,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                    marginLeft: 2,
                  }}
                >
                  {unreadAlerts}
                </span>
              )}
              {!tab.inline && (
                <span style={{ fontSize: 10, color: "#9B9B9B" }}>→</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "dashboard" && children}
      {activeTab === "system" && <SystemHealth />}
      {activeTab === "alerts" && <AlertsAndLogs />}
      {activeTab === "analytics" && <AnalyticsDashboard />}
    </div>
  );
}
