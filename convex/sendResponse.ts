import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, messageId: string, body: string, author: string, url: string) => {
  const response = { messageId, body, author, url }
  await mutationCtx.db.insert('responses', response)
})
