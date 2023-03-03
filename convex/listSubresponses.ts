import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }, responseId): Promise<Document<'subresponses'>[]> => {
  return await db.query('subresponses').order("asc").filter((q) => q.eq(q.field("responseId"), responseId)).collect()
})
