import { config as loadEnv } from "dotenv";

// Next.js reads .env.local first; mirror that for the Prisma CLI + seed script
// so DATABASE_URL resolves to the same database the app uses.
// Load order matters: dotenv does not override already-set vars, so .env.local wins.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });