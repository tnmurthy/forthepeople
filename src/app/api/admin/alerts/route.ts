/**
 * ForThePeople.in — Admin Alerts API
 * GET    /api/admin/alerts?level=critical&read=false&limit=50&offset=0
 * PATCH  /api/admin/alerts — { ids: [...] } or { markAllRead: true }
 * DELETE /api/admin/alerts — { olderThanDays: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const COOKIE = "ftp_admin_v1";

async function isAuthed() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === "ok";
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const level = sp.get("level");
  const read = sp.get("read");
  const limit = Math.min(Number(sp.get("limit") || 50), 200);
  const offset = Number(sp.get("offset") || 0);

  const where: Record<string, unknown> = {};
  if (level) where.level = level;
  if (read === "true") where.read = true;
  if (read === "false") where.read = false;

  const [alerts, total] = await Promise.all([
    prisma.adminAlert.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.adminAlert.count({ where }),
  ]);

  return NextResponse.json({ alerts, total });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.markAllRead) {
    const result = await prisma.adminAlert.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return NextResponse.json({ updated: result.count });
  }

  if (Array.isArray(body.ids) && body.ids.length > 0) {
    const result = await prisma.adminAlert.updateMany({
      where: { id: { in: body.ids } },
      data: { read: true },
    });
    return NextResponse.json({ updated: result.count });
  }

  return NextResponse.json({ error: "Provide ids array or markAllRead" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const days = Number(body.olderThanDays);
  if (!days || days < 1) {
    return NextResponse.json({ error: "olderThanDays must be >= 1" }, { status: 400 });
  }

  const cutoff = new Date(Date.now() - days * 86_400_000);
  const result = await prisma.adminAlert.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return NextResponse.json({ deleted: result.count });
}
