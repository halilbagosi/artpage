import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "media",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "painting",
        label: "Paintings",
        path: "content/paintings",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Artwork Image",
            required: true,
          },
          {
            type: "string",
            name: "month",
            label: "Month",
            options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          },
          {
            type: "string",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "medium",
            label: "Medium",
          },
          {
            type: "string",
            name: "category",
            label: "Category (Subject)",
            options: ["portraits", "landscapes", "abstract"],
          },
          {
            type: "string",
            name: "palette",
            label: "Palette",
            options: ["cool", "warm", "neutral"],
          },
          {
            type: "string",
            name: "style",
            label: "Style",
            options: ["realism", "2d"],
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
          },
        ],
      },
      {
        name: "photography",
        label: "Photography",
        path: "content/photography",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Photo",
            required: true,
          },
          {
            type: "string",
            name: "client",
            label: "Client / Campaign",
          },
          {
            type: "string",
            name: "category",
            label: "Category / Sub-campaign",
          },
          {
            type: "string",
            name: "role",
            label: "Role",
          },
        ],
      },
      {
        name: "videography",
        label: "Videography",
        path: "content/videography",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["weddings", "dentistry"],
            required: true,
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail Image",
            required: true,
          },
          {
            type: "string",
            name: "videoUrl",
            label: "Video File URL (Local MP4 or external)",
            required: true,
          },
        ],
      },
      {
        name: "about",
        label: "About Page",
        path: "content/about",
        format: "md",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "image",
            name: "profileImage",
            label: "Profile Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Biography",
            isBody: true,
          },
        ],
      },
    ],
  },
});
