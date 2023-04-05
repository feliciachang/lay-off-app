import { mutation } from './_generated/server'

export default mutation(async ({ db }, name: string, messageIds: string[], userId: string | null) => {
  const room = { name, messageIds, userId }
  await db.insert('rooms', room)
})
