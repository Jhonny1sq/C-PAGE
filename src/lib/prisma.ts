import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in your environment (see .env.example). " +
        "Sessions and database features require it at runtime."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazily connect on first property access. Importing this module (for example
// while `next build` collects page data) must never require DATABASE_URL to be
// present, otherwise builds fail before runtime env vars are available.
const prismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, property) {
    return property in getClient();
  },
});

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") {
  // Keep a reference so HMR does not leak connections in development.
  const warm = () => {
    try {
      globalForPrisma.prisma = getClient();
    } catch {
      // DATABASE_URL not set yet; the proxy will retry on first real use.
    }
  };
  warm();
}