import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db }, roomId): Promise<Doc<'rooms'>[]> => {
  return await db.query('rooms').order("asc").filter((q) => q.eq(q.field("name"), roomId)).collect()
})
