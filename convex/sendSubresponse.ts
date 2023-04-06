import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, responseId: string, body: string, author: string, url: string, userId: string | null) => {
  const response = { responseId, body, author, url, userId }
  await mutationCtx.db.insert('subresponses', response)
})
