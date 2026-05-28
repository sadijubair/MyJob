"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "bn"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  formatNumber: (num: number | string) => string
  formatDate: (dateString: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appName: "MyJobs",
    appSubtitle: "Bangladesh Job Circulars",
    // Hero
    bangladeshJobs: "🇧🇩 Bangladesh Jobs",
    activeJobs: "Active Jobs",
    findDreamJob: "Find Your Dream Job",
    heroSubtitle: "Explore the latest government and private job circulars in Bangladesh.",
    searchPlaceholder: "Search circulars...",
    // Filter Chips
    filterAll: "All",
    filterToday: "Today",
    filter3days: "3 Days",
    filter7days: "7 Days",
    filterExpired: "Expired",
    // Stats
    jobsAvailable: "jobs available",
    latest: "Latest",
    comingSoon: "Coming Soon",
    searchDevelopment: "Search feature is under development.",
    savedDevelopment: "Saved jobs will be available soon.",
    // Job Card / Drawer
    postsCount: "Posts",
    postUnit: "Post",
    free: "Free",
    freeApplication: "Free Application",
    dueToday: "Due Today",
    expired: "Expired",
    daysLeft: "d left",
    dayLeft: "d left",
    deadline: "Deadline",
    numberOfPosts: "Number of Posts",
    payGrade: "Pay Grade",
    applicationFee: "Application Fee",
    importantNotice: "Important Notice",
    disclaimer: "Please verify all information from the official job circular before applying. MyJobs only shares publicly available circular information.",
    viewCircular: "View Circular",
    applyNow: "Apply Now",
    applicationClosed: "Application Closed",
    notMentioned: "Not Mentioned",
    noticeDesc: "Please verify all information from the official job circular before applying. MyJobs only shares publicly available circular information.",
    // Empty State
    noPositions: "No positions found",
    tryDifferentFilter: "Try a different filter or check back later.",
    showAllJobs: "Show all jobs",
    noSavedJobs: "No saved jobs yet",
    noSavedJobsDesc: "Tap the bookmark icon in any job circular details to save it.",
    browseJobs: "Browse Jobs",
    // Footer
    footerDesc: "Bangladesh job circular mobile platform.",
    updatedDaily: "Updated Daily",
    developedWith: "Developed with ♥ by Sadi Sir",
    // Nav
    navHome: "Home",
    navSearch: "Search",
    navSaved: "Saved",
    navAbout: "About",
    // About Page
    aboutTitle: "About Developer",
    devName: "Mohammad Sadi",
    devRole: "Lead Web Developer",
    devBio: "I am a little baby-boy in web development, expertise in HTML, CSS, PHP, React, Bootstrap etc.",
    devLocation: "Chittagong, Bangladesh",
    devCompany: "@OGIT-BD",
    viewGitHub: "View GitHub Profile",
    repositories: "Repositories",
    followers: "Followers",
    following: "Following",
    joinedGitHub: "Joined GitHub",
    contactMe: "Contact Developer",
    technicalDetails: "Technical Information",
    // Notifications
    notificationsTitle: "Notifications",
    jobsTodayTitle: "Closing Today",
    jobsTodayDesc: "{count} jobs are closing today. Apply now!",
    jobsTodayEmpty: "No jobs closing today.",
    jobs3DaysTitle: "Closing in 3 Days",
    jobs3DaysDesc: "{count} jobs are closing within 3 days.",
    jobs3DaysEmpty: "No jobs closing in 3 days.",
    allCaughtUp: "All caught up!",
    allCaughtUpDesc: "No urgent deadlines to track.",
    pwaPushTitle: "Mobile Push Alerts",
    pwaPushDesc: "Receive direct background push notifications on your mobile device for urgent deadline circulars.",
    pwaPushSubscribed: "Subscribed",
    pwaPushUnsubscribed: "Get Alerts",
    pwaPushBlocked: "Blocked",
    pwaPushUnsupported: "Not Supported",
    // Redesigned Settings Page
    settingsTitle: "Settings & Info",
    preferencesSection: "Preferences",
    languageLabel: "Language / ভাষা",
    themeLabel: "Theme Mode",
    themeLight: "Light Theme",
    themeDark: "Dark Theme",
    appDetailsSection: "Application Details",
    installAppTitle: "Install App",
    installAppDesc: "Add MyJobs to your home screen for quick access",
    installAppButton: "Install",
    installAppInstalled: "Installed"
  },
  bn: {
    // Header
    appName: "MyJobs",
    appSubtitle: "বাংলাদেশ জব সার্কুলারস",
    // Hero
    bangladeshJobs: "🇧🇩 বাংলাদেশ জবস",
    activeJobs: "চলমান চাকরি",
    findDreamJob: "আপনার স্বপ্নের চাকরিটি খুঁজুন",
    heroSubtitle: "বাংলাদেশের সর্বশেষ সরকারি ও বেসরকারি চাকরির সার্কুলারগুলো দেখুন।",
    searchPlaceholder: "সার্কুলার খুঁজুন...",
    // Filter Chips
    filterAll: "সব",
    filterToday: "আজ",
    filter3days: "৩ দিন",
    filter7days: "৭ দিন",
    filterExpired: "মেয়াদোত্তীর্ণ",
    // Stats
    jobsAvailable: "টি চাকরি উপলব্ধ",
    latest: "সর্বশেষ",
    comingSoon: "শীঘ্রই আসছে",
    searchDevelopment: "অনুসন্ধান ফিচারটি উন্নয়নাধীন রয়েছে।",
    savedDevelopment: "সংরক্ষিত চাকরি ফিচারটি শীঘ্রই উপলব্ধ হবে।",
    // Job Card / Drawer
    postsCount: "টি পদ",
    postUnit: "টি পদ",
    free: "ফ্রি",
    freeApplication: "ফ্রি আবেদন",
    dueToday: "আজ শেষ হবে",
    expired: "মেয়াদ শেষ",
    daysLeft: "দিন বাকি",
    dayLeft: "দিন বাকি",
    deadline: "শেষ তারিখ",
    numberOfPosts: "পদের সংখ্যা",
    payGrade: "বেতন গ্রেড",
    applicationFee: "আবেদন ফি",
    importantNotice: "গুরুত্বপূর্ণ নোটিশ",
    disclaimer: "আবেদন করার পূর্বে অনুগ্রহ করে অফিসিয়াল জব সার্কুলার থেকে সমস্ত তথ্য যাচাই করুন। মাইজবস শুধুমাত্র জনসমক্ষে উপলব্ধ সার্কুলারের তথ্য শেয়ার করে।",
    viewCircular: "সার্কুলার দেখুন",
    applyNow: "আবেদন করুন",
    applicationClosed: "আবেদন বন্ধ",
    notMentioned: "উল্লেখ করা হয়নি",
    noticeDesc: "আবেদন করার পূর্বে অনুগ্রহ করে অফিসিয়াল জব সার্কুলার থেকে সমস্ত তথ্য যাচাই করুন। মাইজবস শুধুমাত্র জনসমক্ষে উপলব্ধ সার্কুলারের তথ্য শেয়ার করে।",
    // Empty State
    noPositions: "কোনো চাকরি পাওয়া যায়নি",
    tryDifferentFilter: "অন্য ফিল্টার চেষ্টা করুন অথবা পরে আবার দেখুন।",
    showAllJobs: "সব চাকরি দেখুন",
    noSavedJobs: "কোনো সংরক্ষিত চাকরি নেই",
    noSavedJobsDesc: "সংরক্ষণ করতে যেকোনো জব সার্কুলারের বিস্তারিত দেখতে বুকমার্ক আইকনে ট্যাপ করুন।",
    browseJobs: "চাকরি ব্রাউজ করুন",
    // Footer
    footerDesc: "বাংলাদেশ জব সার্কুলার মোবাইল প্ল্যাটফর্ম।",
    updatedDaily: "প্রতিদিন আপডেট করা হয়",
    developedWith: "Sadi Sir দ্বারা ভালোবাসার সাথে তৈরি",
    // Nav
    navHome: "হোম",
    navSearch: "অনুসন্ধান",
    navSaved: "সংরক্ষিত",
    navAbout: "আমাদের সম্পর্কে",
    // About Page
    aboutTitle: "ডেভেলপার পরিচিতি",
    devName: "মোহাম্মদ সাদী",
    devRole: "লিড ওয়েব ডেভেলপার",
    devBio: "আমি ওয়েব ডেভেলপমেন্টের এক শিক্ষানবিস, এইচটিএমএল, সিএসএস, পিএইচপি, রিঅ্যাক্ট, বুটস্ট্র্যাপ ইত্যাদিতে দক্ষ।",
    devLocation: "চট্টগ্রাম, বাংলাদেশ",
    devCompany: "@ওজিআইটি-বিডি",
    viewGitHub: "গিথুব প্রোফাইল দেখুন",
    repositories: "রিপোজিটরি",
    followers: "অনুসারী",
    following: "অনুসরণ করছেন",
    joinedGitHub: "গিথুবে যোগদান",
    contactMe: "ডেভেলপারের সাথে যোগাযোগ",
    technicalDetails: "কারিগরী তথ্যাদি",
    // Notifications
    notificationsTitle: "নোটিফিকেশন",
    jobsTodayTitle: "আজ শেষ হচ্ছে",
    jobsTodayDesc: "{count}টি চাকরির মেয়াদ আজ শেষ হচ্ছে। এখনই আবেদন করুন!",
    jobsTodayEmpty: "আজ শেষ হওয়ার মতো কোনো চাকরি নেই।",
    jobs3DaysTitle: "৩ দিনের মধ্যে শেষ হচ্ছে",
    jobs3DaysDesc: "{count}টি চাকরির মেয়াদ আগামী ৩ দিনের মধ্যে শেষ হচ্ছে।",
    jobs3DaysEmpty: "৩ দিনের মধ্যে শেষ হওয়ার মতো কোনো চাকরি নেই।",
    allCaughtUp: "সব শেষ!",
    allCaughtUpDesc: "জরুরি কোনো ডেডলাইন নেই।",
    pwaPushTitle: "মোবাইল পুশ নোটিফিকেশন",
    pwaPushDesc: "জরুরি চাকরির আবেদনের সময়সীমা শেষ হওয়ার পূর্বে সরাসরি আপনার মোবাইলে পুশ নোটিফিকেশন পান।",
    pwaPushSubscribed: "চালু আছে",
    pwaPushUnsubscribed: "চালু করুন",
    pwaPushBlocked: "ব্লক করা",
    pwaPushUnsupported: "সমর্থিত নয়",
    // Redesigned Settings Page
    settingsTitle: "সেটিংস ও তথ্য",
    preferencesSection: "পছন্দসমূহ",
    languageLabel: "ভাষা / Language",
    themeLabel: "থিম মোড",
    themeLight: "লাইট থিম",
    themeDark: "ডার্ক থিম",
    appDetailsSection: "অ্যাপ্লিকেশন তথ্য",
    installAppTitle: "অ্যাপ ইনস্টল",
    installAppDesc: "দ্রুত অ্যাক্সেসের জন্য MyJobs হোম স্ক্রিনে যোগ করুন",
    installAppButton: "ইনস্টল",
    installAppInstalled: "ইনস্টল হয়েছে"
  }
}

const banglaMonths = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
]

const englishMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved === "en" || saved === "bn") {
      setLanguageState(saved)
    }

    // Register Service Worker for Web Push notifications
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered with scope:", reg.scope)
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err)
        })
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const formatNumber = (num: number | string): string => {
    if (language === "en") return String(num)
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
    return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)])
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear()

    if (language === "en") {
      return `${day.toString().padStart(2, "0")} ${englishMonths[monthIndex]} ${year}`
    } else {
      const bnDay = formatNumber(day.toString().padStart(2, "0"))
      const bnMonth = banglaMonths[monthIndex]
      const bnYear = formatNumber(year.toString())
      return `${bnDay} ${bnMonth} ${bnYear}`
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, formatDate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
