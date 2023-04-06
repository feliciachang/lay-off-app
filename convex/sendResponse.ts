import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, messageId: string, body: string, author: string, url: string, userId: string | null) => {
  const response = { messageId, body, author, url, userId }
  await mutationCtx.db.insert('responses', response)
})
