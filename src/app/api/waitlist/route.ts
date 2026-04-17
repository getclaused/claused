import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const waitlistSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요."),
  occupation: z.enum(["freelancer", "startup", "smb", "inhouse", "other"]),
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await getSupabaseAdmin()
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneHourAgo);

  return (count ?? 0) >= 3;
}

async function sendConfirmationEmail(email: string) {
  await getResend().emails.send({
    from: "Claused <hi@claused.kr>",
    to: email,
    subject: "Claused 베타 테스터 신청 확인",
    html: `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:'IBM Plex Sans KR',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <div style="background:#FFFFFF;border-radius:2px;padding:40px 32px;border-top:3px solid #8B0000;">
      <p style="font-size:13px;letter-spacing:0.15em;color:#A87D2E;margin:0 0 24px;">CLAUSED</p>
      <h1 style="font-size:22px;color:#0F1419;margin:0 0 16px;font-weight:700;">
        베타 테스터 신청이 완료되었습니다.
      </h1>
      <p style="font-size:15px;line-height:1.7;color:#555;margin:0 0 24px;">
        안녕하세요,<br/><br/>
        Claused 베타 테스터로 신청해주셔서 감사합니다.<br/>
        2026년 7월 런칭 시 가장 먼저 초대장을 보내드리겠습니다.<br/><br/>
        베타 테스터에게는 <strong style="color:#8B0000;">런칭 후 6개월간 50% 할인</strong>과<br/>
        파운더 직접 1:1 피드백 세션이 제공됩니다.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:13px;color:#999;margin:0;line-height:1.6;">
        Pie Nest Inc.<br/>
        이 메일은 claused.kr 베타 신청 확인 메일입니다.<br/>
        문의: <a href="mailto:hi@claused.kr" style="color:#A87D2E;">hi@claused.kr</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const { email, occupation } = parsed.data;
    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    // Rate limit check
    if (ip !== "unknown") {
      const isLimited = await checkRateLimit(ip);
      if (isLimited) {
        return NextResponse.json(
          { error: "요청이 너무 많습니다. 1시간 후 다시 시도해주세요." },
          { status: 429 }
        );
      }
    }

    // Insert into waitlist
    const { error: dbError } = await getSupabaseAdmin().from("waitlist").insert({
      email,
      occupation,
      ip_address: ip === "unknown" ? null : ip,
      user_agent: userAgent,
    });

    // Handle duplicate email
    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json({ already_exists: true });
      }
      console.error("Waitlist insert error:", dbError);
      return NextResponse.json(
        { error: "등록 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // Send confirmation email (fire and forget — don't block response)
    sendConfirmationEmail(email).catch((emailError) => {
      console.error("Confirmation email error:", emailError);
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
