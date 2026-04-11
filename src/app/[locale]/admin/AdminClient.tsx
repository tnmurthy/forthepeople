"use client";

import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Activity,
  Bell,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import SystemHealth from "./SystemHealth";
import AlertsAndLogs from "./AlertsAndLogs";
import AnalyticsDashboard from "./AnalyticsDashboard";
import CostsTab from "./CostsTab";

type TabId = "dashboard" | "system" | "alerts" | "analytics" | "costs";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const TABS: Tab[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "system", label: "System Health", icon: Activity },
  { id: "alerts", label: "Alerts & Logs", icon: Bell },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "costs", label: "Costs", icon: DollarSign },
];

export default function AdminClient({
  children,
}: {
  children: ReactNode;
  locale: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Sub-tab bar — dashboard sections only */}
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
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
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
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "dashboard" && children}
      {activeTab === "system" && <SystemHealth />}
      {activeTab === "alerts" && <AlertsAndLogs />}
      {activeTab === "analytics" && <AnalyticsDashboard />}
      {activeTab === "costs" && <CostsTab />}
    </div>
  );
}
