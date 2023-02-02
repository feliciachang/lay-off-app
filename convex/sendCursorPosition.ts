import { mutation } from './_generated/server'

export default mutation(async ({ db }, x: number, y: number, type: string) => {
  await db.insert('cursorPositions', {
    x,
    y,
    type,
  })
})
