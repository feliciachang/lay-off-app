import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  messages: defineTable({
    author: s.string(),
    body: s.string(),
    url: s.string(),
    roomId: s.union(s.string(), s.null()),
    sent: s.union(s.boolean(), s.null()),
  }),
  responses: defineTable({
    messageId: s.string(),
    body: s.string(),
    url: s.string(),
    author: s.string(),
  }),
  rooms: defineTable({
    name: s.string(),
    messageIds: s.array(s.string()),
  })
})
