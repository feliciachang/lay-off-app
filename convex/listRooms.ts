import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db }): Promise<Doc<'rooms'>[]> => {
  return await db.query('rooms').order("asc").collect()
})
