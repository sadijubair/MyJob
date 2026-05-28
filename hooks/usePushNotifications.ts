"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const { language } = useLanguage()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      setLoading(false)
      return
    }

    setPermission(Notification.permission)

    async function checkSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready
        if (registration.pushManager) {
          const subscription = await registration.pushManager.getSubscription()
          setIsSubscribed(!!subscription)
        }
      } catch (err) {
        console.error("Error checking push subscription:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const subscribeToPush = async () => {
    if (permission === "unsupported") return false

    setLoading(true)
    try {
      // 1. Request Permission
      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult)

      if (permissionResult !== "granted") {
        setLoading(false)
        return false
      }

      // 2. Register with VAPID Key
      const registration = await navigator.serviceWorker.ready
      if (!registration.pushManager) {
        throw new Error("Push manager not supported on this browser")
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // 3. Send subscription to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          language,
        }),
      })

      if (res.ok) {
        setIsSubscribed(true)
        setLoading(false)
        return true
      } else {
        throw new Error("Failed to store subscription on server")
      }
    } catch (err) {
      console.error("Push subscription subscription error:", err)
      setIsSubscribed(false)
      setLoading(false)
      return false
    }
  }

  const unsubscribeFromPush = async () => {
    if (permission === "unsupported" || !isSubscribed) return false

    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      if (!registration.pushManager) return false

      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        // 1. Delete on server
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })

        // 2. Unsubscribe locally
        await subscription.unsubscribe()
      }

      setIsSubscribed(false)
      setLoading(false)
      return true
    } catch (err) {
      console.error("Push unsubscription error:", err)
      setLoading(false)
      return false
    }
  }

  return {
    isSubscribed,
    permission,
    loading,
    subscribeToPush,
    unsubscribeFromPush,
  }
}
