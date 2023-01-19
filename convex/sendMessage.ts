import { mutation } from './_generated/server'

export default mutation(async ({ db }, body: string, author: string, url: string, roomId: string | null, sent: boolean | null) => {
  const message = { body, author, url, roomId, sent }
  await db.insert('messages', message)
})
