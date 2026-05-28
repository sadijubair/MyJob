import { withPayload } from "@payloadcms/next/withPayload"

/**
 * Vercel deployment steps:
 * 1. Push to GitHub.
 * 2. Import the repo on vercel.com.
 * 3. Add env vars: DATABASE_URI, PAYLOAD_SECRET,
 *    NEXT_PUBLIC_SERVER_URL (production URL), REVALIDATE_SECRET,
 *    NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY.
 * 4. `next build` runs Payload migrations automatically.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
}

export default withPayload(nextConfig)