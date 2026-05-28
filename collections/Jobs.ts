import type { CollectionConfig } from "payload"

const revalidateSecret = process.env.REVALIDATE_SECRET ?? ""
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const Jobs: CollectionConfig = {
  slug: "jobs",
  admin: {
    defaultColumns: ["organization", "postName", "deadline", "numberOfPosts"],
    useAsTitle: "organization",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          await fetch(`${serverURL}/api/revalidate`, {
            method: "POST",
            headers: {
              "x-revalidate-secret": revalidateSecret,
            },
          })
        } catch {
          // Revalidation is best-effort so CMS saves never fail on a transient network issue.
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: "organization",
      type: "text",
      required: true,
    },
    {
      name: "postName",
      type: "text",
      label: "Post Name",
      required: true,
    },
    {
      name: "numberOfPosts",
      type: "number",
      label: "Number of Posts",
      required: true,
    },
    {
      name: "payGrade",
      type: "text",
      label: "Pay Grade",
      required: false,
    },
    {
      name: "circularLink",
      type: "text",
      label: "Circular Link",
      required: false,
    },
    {
      name: "applicationFee",
      type: "text",
      label: "Application Fee",
      required: false,
    },
    {
      name: "applicationLink",
      type: "text",
      label: "Application Link",
      required: true,
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
  ],
}