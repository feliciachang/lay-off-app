import { mutation } from './_generated/server'

// messages: defineTable({
//   author: s.string(),
//   body: s.string(),
//   details: s.union(s.string(), s.null()),
//   time: s.union(s.string(), s.null()),
//   url: s.string(),
//   roomId: s.union(s.string(), s.null()),
// }),

export default mutation(
  async (
    mutationCtx: any,
    body: string,
    author: string,
    url: string,
    roomId: string | null,
    details: string | null,
    time: string | null,
    userId: string | null,
  ) => {
    const message = { body, author, url, roomId, details, time, userId }
    const ret = await mutationCtx.db.insert('messages', message)
    return ret
  }
)
