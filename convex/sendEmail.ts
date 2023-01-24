import { mutation } from './_generated/server'

export default mutation(async ({ db }, email: string) => {
  const response = { email }
  await db.insert('emails', response)
})
