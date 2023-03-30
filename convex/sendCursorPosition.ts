import { mutation } from './_generated/server'

export default mutation(async (mutationCtx: any, x: number, y: number, type: string) => {
  await mutationCtx.db.insert('cursorPositions', {
    x,
    y,
    type,
  })
})
