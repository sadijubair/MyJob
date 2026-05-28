export type FilterType = "all" | "today" | "3days" | "7days" | "expired"

export type Urgency = "today" | "urgent" | "warning" | "ok" | "expired"

export interface Job {
  id: string
  organization: string
  postName: string
  numberOfPosts: number
  payGrade?: string
  circularLink?: string
  applicationFee?: string
  applicationLink: string
  deadline: string
  urgency: Urgency
  daysLeft: number
}