import { postgresAdapter } from "@payloadcms/db-postgres"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"

import { Jobs } from "@/collections/Jobs"
import { PushSubscriptions } from "@/collections/PushSubscriptions"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)"),
    },
  },
  collections: [Jobs, PushSubscriptions],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "myjob-development-secret",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
})