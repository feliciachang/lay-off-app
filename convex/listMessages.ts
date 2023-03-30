import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db }, roomId, order): Promise<Doc<'messages'>[]> => {
  return await db.query('messages').order(order).filter((q) => q.eq(q.field("roomId"), roomId)).collect()
})
