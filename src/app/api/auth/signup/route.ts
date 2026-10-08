import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { email, username, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
  if (existing) {
    const field = existing.email === email ? "Email" : "Username";
    return NextResponse.json(
      { error: `${field} is already taken.` },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({
    data: { email, username, passwordHash },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}