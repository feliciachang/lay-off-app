import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(
  async ({ db }, messageId): Promise<Doc<'responses'>[]> => {
    return await db
      .query('responses')
      .order('desc')
      .filter((q) => q.eq(q.field('messageId'), messageId))
      .collect()
  }
)
