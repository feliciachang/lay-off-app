import { query } from './_generated/server'
import { Document } from './_generated/dataModel'

export default query(async ({ db }, roomId, order): Promise<Document<'messages'>[]> => {
  return await db.query('messages').order(order).filter((q) => q.eq(q.field("roomId"), roomId)).collect()
})
