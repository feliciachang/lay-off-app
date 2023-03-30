import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, body: string, url: string, roomId: string | null) => {
  const message = { body, url, roomId }
  await  mutationCtx.db.insert('quickQuestions', message)
})
