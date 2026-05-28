"use client"

import { useEffect, useState } from "react"
import { 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Layers, 
  ShieldAlert, 
  RefreshCw,
  Info,
  Download,
  CheckCircle2
} from "lucide-react"
import { useLanguage } from "@/lib/language"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { cn } from "@/lib/utils"

export function About() {
  const { t, language, setLanguage } = useLanguage()
  const { 
    isSubscribed, 
    permission, 
    loading: pushLoading, 
    subscribeToPush, 
    unsubscribeFromPush 
  } = usePushNotifications()

  const [dark, setDark] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check initial dark mode state
    if (typeof window !== "undefined") {
      setDark(document.documentElement.classList.contains("dark"))
    }

    // Check if already installed as standalone PWA
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  const handleInstallApp = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === "accepted") {
      setIsInstalled(true)
    }
    setInstallPrompt(null)
  }

  const handleTogglePush = () => {
    if (isSubscribed) {
      unsubscribeFromPush()
    } else {
      subscribeToPush()
    }
  }

  let pushLabel = t("pwaPushUnsubscribed")
  if (permission === "unsupported") {
    pushLabel = t("pwaPushUnsupported")
  } else if (permission === "denied") {
    pushLabel = t("pwaPushBlocked")
  } else if (isSubscribed) {
    pushLabel = t("pwaPushSubscribed")
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Page Title */}
      <div className="px-1 pt-2">
        <h2 className="font-display text-[22px] font-black text-on-surface tracking-tight">
          {t("settingsTitle")}
        </h2>
        <div className="h-1 w-12 rounded-full bg-primary mt-1.5" />
      </div>

      {/* Preferences Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-primary px-1">
          {t("preferencesSection")}
        </h3>
        
        <div className="rounded-[16px] border border-outline-variant/30 bg-surface-container-low p-4 divide-y divide-outline-variant/15">
          
          {/* Language Toggle Row */}
          <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-[13px] font-bold text-on-surface">
                {t("languageLabel")}
              </span>
            </div>
            <button 
              onClick={toggleLanguage}
              className="flex h-9 px-4 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-[12px] font-black hover:bg-surface-container-high transition active:scale-95 cursor-pointer"
            >
              {language === "en" ? "English" : "বাংলা"}
            </button>
          </div>

          {/* Theme Toggle Row */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="flex items-center gap-3">
              {dark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <span className="text-[13px] font-bold text-on-surface">
                {t("themeLabel")}
              </span>
            </div>
            <button 
              onClick={toggleTheme}
              className="flex h-9 px-4 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-[12px] font-black hover:bg-surface-container-high transition active:scale-95 cursor-pointer"
            >
              {dark ? t("themeDark") : t("themeLight")}
            </button>
          </div>

          {/* Push Notifications Toggle Row */}
          <div className="flex flex-col gap-3 py-3.5 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <span className="text-[13px] font-bold text-on-surface">
                  {t("pwaPushTitle")}
                </span>
              </div>
              <button
                disabled={permission === "unsupported" || permission === "denied" || pushLoading}
                onClick={handleTogglePush}
                className={cn(
                  "flex h-9 px-4 items-center justify-center rounded-full text-[12px] font-black transition active:scale-95 cursor-pointer",
                  isSubscribed 
                    ? "bg-m3-rose-container text-m3-on-rose-container hover:bg-m3-rose-container/80" 
                    : "bg-primary text-on-primary hover:bg-primary/95",
                  (permission === "unsupported" || permission === "denied" || pushLoading) && "opacity-50 cursor-not-allowed"
                )}
              >
                {pushLoading 
                  ? "..." 
                  : (isSubscribed 
                      ? (language === "en" ? "Disable" : "বন্ধ করুন") 
                      : (language === "en" ? "Enable" : "চালু করুন")
                    )
                }
              </button>
            </div>
            
            <div className="flex items-center justify-between pl-8">
              <p className="text-[11px] font-semibold text-on-surface-variant/75 max-w-[200px] leading-tight">
                {t("pwaPushDesc")}
              </p>
              <span className={cn(
                "text-[11px] font-bold shrink-0",
                isSubscribed ? "text-m3-emerald" : "text-on-surface-variant/70"
              )}>
                {pushLabel}
              </span>
            </div>
          </div>

          {/* Install App Row */}
          <div className="flex flex-col gap-3 py-3.5 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isInstalled 
                  ? <CheckCircle2 className="h-5 w-5 text-m3-emerald" />
                  : <Download className="h-5 w-5 text-primary" />
                }
                <span className="text-[13px] font-bold text-on-surface">
                  {t("installAppTitle")}
                </span>
              </div>
              <button
                disabled={isInstalled || !installPrompt}
                onClick={handleInstallApp}
                className={cn(
                  "flex h-9 px-4 items-center justify-center rounded-full text-[12px] font-black transition active:scale-95 cursor-pointer",
                  isInstalled
                    ? "bg-m3-emerald-container text-m3-on-emerald-container"
                    : "bg-primary text-on-primary hover:bg-primary/95",
                  (isInstalled || !installPrompt) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isInstalled ? t("installAppInstalled") : t("installAppButton")}
              </button>
            </div>
            
            <div className="flex items-center pl-8">
              <p className="text-[11px] font-semibold text-on-surface-variant/75 leading-tight">
                {t("installAppDesc")}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Application Details Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-primary px-1">
          {t("appDetailsSection")}
        </h3>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Card 1: Version */}
          <div className="rounded-[12px] border border-outline-variant/20 bg-surface-container-low p-3.5 flex flex-col justify-between min-h-[88px] shadow-sm">
            <Info className="h-4.5 w-4.5 text-primary/70" />
            <div>
              <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                Version
              </span>
              <span className="block text-[13px] font-extrabold text-on-surface mt-0.5">
                0.0.1
              </span>
            </div>
          </div>

          {/* Card 2: Platform */}
          <div className="rounded-[12px] border border-outline-variant/20 bg-surface-container-low p-3.5 flex flex-col justify-between min-h-[88px] shadow-sm">
            <Smartphone className="h-4.5 w-4.5 text-primary/70" />
            <div>
              <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                Platform
              </span>
              <span className="block text-[13px] font-extrabold text-on-surface mt-0.5">
                Android Web App
              </span>
            </div>
          </div>

          {/* Card 3: Source */}
          <div className="rounded-[12px] border border-outline-variant/20 bg-surface-container-low p-3.5 flex flex-col justify-between min-h-[88px] shadow-sm">
            <Layers className="h-4.5 w-4.5 text-primary/70" />
            <div>
              <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                Source
              </span>
              <span className="block text-[13px] font-extrabold text-on-surface mt-0.5">
                Public Circulars
              </span>
            </div>
          </div>

          {/* Card 4: Updates */}
          <div className="rounded-[12px] border border-outline-variant/20 bg-surface-container-low p-3.5 flex flex-col justify-between min-h-[88px] shadow-sm">
            <RefreshCw className="h-4.5 w-4.5 text-primary/70" />
            <div>
              <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                Cycle
              </span>
              <span className="block text-[13px] font-extrabold text-on-surface mt-0.5">
                {language === "en" ? "24/7 Daily" : "প্রতিদিন আপডেট"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Card */}
      <div className="rounded-[12px] border border-m3-amber-container/30 bg-m3-amber-container/5 p-4.5 flex gap-3.5 items-start">
        <ShieldAlert className="h-5 w-5 text-m3-amber shrink-0 mt-0.5" />
        <div className="font-sans">
          <h4 className="text-[12px] font-bold text-on-surface uppercase tracking-wider">
            {t("importantNotice")}
          </h4>
          <p className="text-[11px] font-semibold leading-relaxed text-on-surface-variant/90 mt-1">
            {t("disclaimer")}
          </p>
        </div>
      </div>

      {/* Footer Credit Only (No developer details) */}
      <div className="text-center py-4 border-t border-outline-variant/10 mt-2">
        <p className="text-[10px] font-bold text-on-surface-variant/40 tracking-wider">
          {t("developedWith")}
        </p>
      </div>

    </div>
  )
}
