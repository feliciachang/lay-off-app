import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db }): Promise<Doc<'cursorPositions'>[]> => {
  return await db.query('cursorPositions').order('desc').collect()
})
