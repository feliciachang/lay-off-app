import { mutation } from './_generated/server'

export default mutation(async ({ db }, messageId: string, body: string, author: string, url: string, type: string | null) => {
  const response = { messageId, body, author, url, type }
  await db.insert('responses', response)
})
