import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  messages: defineTable({
    author: s.string(),
    body: s.string(),
    url: s.string(),
  }),
  responses: defineTable({
    messageId: s.string(),
    body: s.string(),
    url: s.string(),
    author: s.string(),
  })
})
