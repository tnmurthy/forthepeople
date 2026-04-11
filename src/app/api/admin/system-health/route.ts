/**
 * ForThePeople.in — Admin System Health API
 * GET /api/admin/system-health
 * Returns DB/Redis status, data freshness, scraper logs, pending items, revenue
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

const COOKIE = "ftp_admin_v1";

async function isAuthed() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === "ok";
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const result: Record<string, unknown> = {};

  // ── Database health ────────────────────────────────
  try {
    const dbStart = Date.now();
    const [activeDistricts, totalNewsItems] = await Promise.all([
      prisma.district.count({ where: { active: true } }),
      prisma.newsItem.count(),
    ]);
    result.database = {
      status: "healthy",
      responseMs: Date.now() - dbStart,
      activeDistricts,
      totalNewsItems,
    };
  } catch {
    result.database = { status: "error", responseMs: 0, activeDistricts: 0, totalNewsItems: 0 };
  }

  // ── Redis health ───────────────────────────────────
  try {
    const redisStart = Date.now();
    if (redis) {
      await redis.ping();
      result.redis = { status: "healthy", responseMs: Date.now() - redisStart };
    } else {
      result.redis = { status: "error", responseMs: 0 };
    }
  } catch {
    result.redis = { status: "error", responseMs: 0 };
  }

  // ── Scrapers (last 24h) ────────────────────────────
  try {
    const since = new Date(Date.now() - 86_400_000);
    const [logs, total, successful, failed] = await Promise.all([
      prisma.scraperLog.findMany({
        where: { startedAt: { gte: since } },
        orderBy: { startedAt: "desc" },
        take: 10,
      }),
      prisma.scraperLog.count({ where: { startedAt: { gte: since } } }),
      prisma.scraperLog.count({ where: { startedAt: { gte: since }, status: "success" } }),
      prisma.scraperLog.count({ where: { startedAt: { gte: since }, status: "error" } }),
    ]);
    result.scrapers = {
      last24h: { total, successful, failed },
      recentLogs: logs.map((l) => ({
        id: l.id,
        jobName: l.jobName,
        status: l.status,
        recordsAffected: (l.recordsNew ?? 0) + (l.recordsUpdated ?? 0),
        durationMs: l.duration ?? 0,
        error: l.error,
        createdAt: l.startedAt?.toISOString() ?? null,
      })),
    };
  } catch {
    result.scrapers = { last24h: { total: 0, successful: 0, failed: 0 }, recentLogs: [] };
  }

  // ── Data freshness ─────────────────────────────────
  try {
    const districts = await prisma.district.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    const freshness = await Promise.all(
      districts.map(async (d) => {
        const [weather, news, crops, aiInsight] = await Promise.all([
          prisma.weatherReading.findFirst({
            where: { districtId: d.id },
            orderBy: { recordedAt: "desc" },
            select: { recordedAt: true },
          }),
          prisma.newsItem.findFirst({
            where: { districtId: d.id },
            orderBy: { publishedAt: "desc" },
            select: { publishedAt: true },
          }),
          prisma.cropPrice.findFirst({
            where: { districtId: d.id },
            orderBy: { date: "desc" },
            select: { date: true },
          }),
          prisma.aIModuleInsight.findFirst({
            where: { districtId: d.id },
            orderBy: { generatedAt: "desc" },
            select: { generatedAt: true },
          }),
        ]);
        return {
          district: d.name,
          slug: d.slug,
          weather: weather?.recordedAt?.toISOString() ?? null,
          news: news?.publishedAt?.toISOString() ?? null,
          crops: crops?.date?.toISOString() ?? null,
          aiInsights: aiInsight?.generatedAt?.toISOString() ?? null,
        };
      })
    );
    result.dataFreshness = freshness;
  } catch {
    result.dataFreshness = [];
  }

  // ── Pending items ──────────────────────────────────
  try {
    const [reviews, feedback, alerts, unreadAlerts] = await Promise.all([
      prisma.reviewQueue.count({ where: { status: "pending" } }),
      prisma.feedback.count({ where: { status: "new" } }),
      prisma.localAlert.count({ where: { active: true } }),
      prisma.adminAlert.count({ where: { read: false } }),
    ]);
    result.pendingItems = { reviews, feedback, alerts, unreadAlerts };
  } catch {
    result.pendingItems = { reviews: 0, feedback: 0, alerts: 0, unreadAlerts: 0 };
  }

  // ── Contributions ──────────────────────────────────
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);
    const [last7, allSuccess] = await Promise.all([
      prisma.supporter.findMany({
        where: { status: "success", createdAt: { gte: sevenDaysAgo } },
        select: { amount: true },
      }),
      prisma.supporter.findMany({
        where: { status: "success" },
        select: { amount: true },
      }),
    ]);
    result.contributions = {
      last7days: last7.reduce((s, x) => s + x.amount, 0),
      totalRevenue: allSuccess.reduce((s, x) => s + x.amount, 0),
    };
  } catch {
    result.contributions = { last7days: 0, totalRevenue: 0 };
  }

  result.serverTimeMs = Date.now() - start;
  result.timestamp = new Date().toISOString();

  return NextResponse.json(result);
}
