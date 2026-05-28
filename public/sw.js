// public/sw.js
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const title = data.title || "MyJobs Update"
    const options = {
      body: data.body || "New job circulars are available.",
      icon: "/pwa_icon.png",
      badge: "/pwa_icon.png",
      data: {
        url: data.url || "/?tab=home",
      },
      vibrate: [100, 50, 100],
      actions: [
        {
          action: "open",
          title: "View Circulars",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(title, options))
  } catch (err) {
    console.error("Error parsing push notification data:", err)
    
    // Fallback if data is not JSON
    const text = event.data.text()
    event.waitUntil(
      self.registration.showNotification("MyJobs", {
        body: text || "New job circular update!",
        icon: "/pwa_icon.png",
        badge: "/pwa_icon.png",
        data: {
          url: "/?tab=home",
        },
      })
    )
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/?tab=home"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there is already a window open with this origin
      for (const client of clientList) {
        const matchesOrigin = client.url.startsWith(self.location.origin)
        if (matchesOrigin && "focus" in client) {
          // Navigate the open window to the target URL and focus it
          return client.navigate(urlToOpen).then((focusedClient) => {
            if (focusedClient && "focus" in focusedClient) {
              return focusedClient.focus()
            }
          })
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
