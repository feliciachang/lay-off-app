import { mutation } from './_generated/server'

export default mutation(async ({ db }, body: string, author: string, url: string, roomId: string) => {
  const message = { body, author, url, roomId }
  await db.insert('messages', message)
})
