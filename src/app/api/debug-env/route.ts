import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    keyIdPrefix: process.env.RAZORPAY_KEY_ID?.slice(0, 12) ?? "NOT SET",
    hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    secretLen: process.env.RAZORPAY_KEY_SECRET?.length ?? 0,
    hasPublicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    publicKeyPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.slice(0, 12) ?? "NOT SET",
    hasPlanMonthly: !!process.env.RAZORPAY_PLAN_MONTHLY,
    planMonthlyPrefix: process.env.RAZORPAY_PLAN_MONTHLY?.slice(0, 10) ?? "NOT SET",
  });
}
