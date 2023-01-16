import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }, roomId): Promise<Document<'rooms'>[]> => {
  return await db.query('rooms').order("asc").filter((q) => q.eq(q.field("_id"), roomId)).collect()
})
