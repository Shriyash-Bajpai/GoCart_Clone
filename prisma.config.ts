// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({

  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // required — MUST be present in .env
    url: env("DATABASE_URL"),

    // optional — do not force DIRECT_URL if not needed
    //directUrl: process.env.DIRECT_URL || undefined,
  },
});
