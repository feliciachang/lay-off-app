import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  messages: defineTable({
    author: s.string(),
    body: s.string(),
    details: s.union(s.string(), s.null()),
    time: s.union(s.string(), s.null()),
    url: s.string(),
    roomId: s.union(s.string(), s.null()),
    userId: s.union(s.string(), s.null()),
  }),
  responses: defineTable({
    messageId: s.string(),
    body: s.string(),
    url: s.string(),
    author: s.string(),
    userId: s.union(s.string(), s.null()),
  }),
  subresponses: defineTable({
    responseId: s.string(),
    body: s.string(),
    author: s.string(),
    url: s.string(),
    userId: s.union(s.string(), s.null()),
  }),
  rooms: defineTable({
    name: s.string(),
    messageIds: s.array(s.string()),
    userId: s.union(s.string(), s.null()),
  }),
  quickQuestions: defineTable({
    body: s.string(),
    url: s.string(),
    roomId: s.union(s.string(), s.null()),
  }),
  emails: defineTable({
    email: s.string(),
  }),
  cursorPositions: defineTable({
    // coordinates
    x: s.number(),
    y: s.number(),
    // what type of cursor is it
    type: s.string(),
  }),
})
