import { mutation } from './_generated/server'

export default mutation(async ({ db }, messageId: string, body: string, author: string, url: string) => {
  const response = { messageId, body, author, url }
  await db.insert('responses', response)
})
