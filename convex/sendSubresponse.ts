import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, responseId: string, body: string, author: string, url: string) => {
  const response = { responseId, body, author, url }
  await mutationCtx.db.insert('subresponses', response)
})
