import { mutation } from './_generated/server'

export default mutation(async ({ db }, messageId: string, body: string, author: string, url: string, imageId: string | null, imageUrl: string | null) => {
  const response = { messageId, body, author, url, imageId, imageUrl }
  await db.insert('responses', response)
})
