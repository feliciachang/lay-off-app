import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }, messageId): Promise<Document<'responses'>[]> => {
  return await db.query('responses').order("asc").filter((q) => q.eq(q.field("messageId"), messageId)).collect()
})
