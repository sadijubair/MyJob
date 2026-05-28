import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret") ?? ""

  if (secret !== (process.env.REVALIDATE_SECRET ?? "")) {
    return Response.json({ revalidated: false }, { status: 401 })
  }

  revalidatePath("/")

  return Response.json({ revalidated: true })
}