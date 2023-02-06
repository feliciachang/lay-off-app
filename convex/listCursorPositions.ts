import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }): Promise<Document<'cursorPositions'>[]> => {
  return await db.query('cursorPositions').order('desc').collect()
})
