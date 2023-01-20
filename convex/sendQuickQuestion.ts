import { mutation } from './_generated/server'

export default mutation(async ({ db }, body: string, url: string, roomId: string | null) => {
  const message = { body, url, roomId }
  await db.insert('quickQuestions', message)
})
