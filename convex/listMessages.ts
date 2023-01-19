import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }, roomId, sent): Promise<Document<'messages'>[]> => {
  return await db.query('messages').order("asc").filter((q) => q.eq(q.field("roomId"), roomId)).filter((q) => q.eq(q.field("sent"), sent)).collect()
})
