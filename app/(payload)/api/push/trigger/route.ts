import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { getJobs } from "@/lib/getJobs"

export async function POST(req: NextRequest) {
  try {
    // Configure VAPID at runtime (not build time) so env vars are available
    webpush.setVapidDetails(
      "mailto:sadijubairr@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )

    // Basic secret header validation
    const secret = req.headers.get("x-revalidate-secret")
    if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // 1. Get all jobs and filter by urgency
    const jobs = await getJobs()
    const todayJobs = jobs.filter((j) => j.daysLeft === 0)
    const threeDaysJobs = jobs.filter((j) => j.daysLeft > 0 && j.daysLeft <= 3)

    if (todayJobs.length === 0 && threeDaysJobs.length === 0) {
      return NextResponse.json({ success: true, message: "No urgent jobs to notify" })
    }

    // 2. Fetch all subscriptions
    const subsRes = await payload.find({
      collection: "push-subscriptions",
      limit: 1000,
    })

    const subscriptions = subsRes.docs
    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: "No active subscriptions" })
    }

    // 3. Helper to format Bangla numbers
    const formatBanglaNumber = (num: number): string => {
      const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
      return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)])
    }

    let successCount = 0
    let failedCount = 0

    // 4. Send notifications
    await Promise.all(
      subscriptions.map(async (sub) => {
        const isBn = sub.language === "bn"
        let title = ""
        let body = ""
        let filterType = "all"

        if (todayJobs.length > 0) {
          title = isBn ? "আজকের চাকরির সতর্কবার্তা! ⏰" : "Today's Deadline Alert! ⏰"
          const countStr = isBn ? formatBanglaNumber(todayJobs.length) : String(todayJobs.length)
          body = isBn 
            ? `${countStr}টি সার্কুলারের মেয়াদ আজ শেষ হচ্ছে! এখনই দেখে নিন।`
            : `${countStr} job circulars are closing today! Apply before midnight.`
          filterType = "today"
        } else {
          title = isBn ? "আসন্ন ডেডলাইন রিমাইন্ডার! 📅" : "Upcoming Deadline Reminder! 📅"
          const countStr = isBn ? formatBanglaNumber(threeDaysJobs.length) : String(threeDaysJobs.length)
          body = isBn 
            ? `${countStr}টি চাকরির মেয়াদ আগামী ৩ দিনের মধ্যে শেষ হচ্ছে।`
            : `${countStr} job circulars are closing within 3 days. Check them out.`
          filterType = "3days"
        }

        const pushPayload = JSON.stringify({
          title,
          body,
          url: `/?tab=home&filter=${filterType}`,
        })

        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        }

        try {
          await webpush.sendNotification(pushSubscription, pushPayload)
          successCount++
        } catch (err: any) {
          failedCount++
          // If subscription is expired (410) or not found (404), clean it up from db
          if (err.statusCode === 410 || err.statusCode === 404) {
            try {
              await payload.delete({
                collection: "push-subscriptions",
                id: sub.id,
              })
            } catch (dbErr) {
              console.error(`Failed to clean up subscription ID ${sub.id}:`, dbErr)
            }
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failedCount,
    })
  } catch (error: any) {
    console.error("Trigger push notifications error:", error)
    return NextResponse.json({ error: error.message || "Failed to trigger push notifications" }, { status: 500 })
  }
}
