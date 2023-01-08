import { mutation } from './_generated/server'

export default mutation(async ({ db }, body: string, author: string, url: string) => {
  const message = { body, author, url }
  await db.insert('messages', message)
})
