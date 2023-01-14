import { mutation } from './_generated/server'

export default mutation(async ({ db }, name: string, messageIds: string[]) => {
  const room = { name, messageIds }
  await db.insert('rooms', room)
})
