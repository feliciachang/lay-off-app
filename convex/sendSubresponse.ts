import { mutation } from './_generated/server'

export default mutation(async ({ db }, responseId: string, body: string, author: string, url: string) => {
  const response = { responseId, body, author, url }
  await db.insert('subresponses', response)
})
