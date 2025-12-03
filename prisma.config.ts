// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // required in the config when you define datasource here

  // path to your schema
  schema: "prisma/schema.prisma",

  // where migrations will be stored (good default)
  migrations: {
    path: "prisma/migrations",
  },

  // this replaces url/directUrl from schema.prisma
  datasource: {
    url: env("DATABASE_URL"),
    // Make DIRECT_URL optional. If not set, `shadowDatabaseUrl` will be undefined
    // (Prisma treats that as not provided). This prevents a hard failure when
    // `DIRECT_URL` is missing while keeping the explicit env helper for
    // `DATABASE_URL`.
    shadowDatabaseUrl: process.env.DIRECT_URL || undefined,
  },
});
