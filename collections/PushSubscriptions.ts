import type { CollectionConfig } from "payload"

export const PushSubscriptions: CollectionConfig = {
  slug: "push-subscriptions",
  admin: {
    defaultColumns: ["endpoint", "language", "createdAt"],
    useAsTitle: "endpoint",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "endpoint",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "expirationTime",
      type: "text",
      required: false,
    },
    {
      name: "p256dh",
      type: "text",
      required: true,
    },
    {
      name: "auth",
      type: "text",
      required: true,
    },
    {
      name: "language",
      type: "select",
      options: [
        { label: "English", value: "en" },
        { label: "Bangla", value: "bn" },
      ],
      required: true,
      defaultValue: "en",
    },
  ],
}
