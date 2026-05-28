# MyJob

MyJob is a mobile-first job deadline tracker for Bangladesh job seekers.

## Stack

- Next.js App Router
- Payload CMS 3.x
- PostgreSQL via Neon
- Tailwind CSS
- shadcn/ui primitives
- date-fns

## Development

```bash
npm install
npm run dev
```

The Payload admin is available at `/admin`.

## Environment

Use [.env.example](.env.example) as the local environment template. The app includes safe fallbacks so it can build without a `.env.local`, but Payload will need real values for `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, and `REVALIDATE_SECRET` before you connect it to Neon in development or production.
