import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  messages: defineTable({
    author: s.string(),
    body: s.string(),
    url: s.string(),
    roomId: s.union(s.string(), s.null()),
  }),
  responses: defineTable({
    messageId: s.string(),
    body: s.string(),
    url: s.string(),
    author: s.string(),
    imageId: s.union(s.string(), s.null()),
    imageUrl: s.union(s.string(), s.null())
  }),
  subresponses: defineTable({
    responseId: s.string(),
    body: s.string(),
    author: s.string(),
    url: s.string(),
  }),
  rooms: defineTable({
    name: s.string(),
    messageIds: s.array(s.string()),
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
