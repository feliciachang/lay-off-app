import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db }, responseId): Promise<Doc<'subresponses'>[]> => {
  return await db.query('subresponses').order("asc").filter((q) => q.eq(q.field("responseId"), responseId)).collect()
})
