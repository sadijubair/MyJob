import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { subscription, language } = body

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if subscription already exists by endpoint
    const existing = await payload.find({
      collection: "push-subscriptions",
      where: {
        endpoint: {
          equals: subscription.endpoint,
        },
      },
      limit: 1,
    })

    const subscriptionData = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime ? String(subscription.expirationTime) : undefined,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      language: language || "en",
    }

    if (existing.docs.length > 0) {
      // Update existing subscription
      const docId = existing.docs[0].id
      await payload.update({
        collection: "push-subscriptions",
        id: docId,
        data: subscriptionData,
      })
    } else {
      // Create new subscription
      await payload.create({
        collection: "push-subscriptions",
        data: subscriptionData,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: error.message || "Failed to subscribe" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json()

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.delete({
      collection: "push-subscriptions",
      where: {
        endpoint: {
          equals: endpoint,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unsubscription error:", error)
    return NextResponse.json({ error: error.message || "Failed to unsubscribe" }, { status: 500 })
  }
}
