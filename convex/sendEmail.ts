import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, email: string) => {
  const response = { email }
  await mutationCtx.db.insert('emails', response)
})
