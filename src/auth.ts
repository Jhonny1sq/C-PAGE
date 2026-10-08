import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 60; // 30 minutes

function githubConfigured() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.avatarUrl,
        };
      },
    }),
    ...(githubConfigured()
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const email =
          user.email ?? (typeof profile?.email === "string" ? profile.email : null);
        if (!email) return "/login?error=github-no-email";

        await prisma.user.upsert({
          where: { githubId: account.providerAccountId },
          update: {
            email,
            avatarUrl: user.image ?? undefined,
          },
          create: {
            email,
            username: await uniqueUsername(
              (profile?.login as string) ?? user.name ?? email.split("@")[0]
            ),
            githubId: account.providerAccountId,
            avatarUrl: user.image ?? undefined,
          },
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "github" && account.providerAccountId) {
        const dbUser = await prisma.user.findUnique({
          where: { githubId: account.providerAccountId },
          select: { id: true },
        });
        if (dbUser) token.uid = dbUser.id;
      } else if (user?.id) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.uid === "string") {
        session.user.id = token.uid;
      }
      return session;
    },
  },
});

async function uniqueUsername(seed: string): Promise<string> {
  const base =
    seed
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 18) || "dev";
  let candidate = base;
  let suffix = 0;
  while (true) {
    const clash = await prisma.user.findUnique({ where: { username: candidate } });
    if (!clash) return candidate;
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
}