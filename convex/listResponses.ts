import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export default query(async ({ db, storage }, messageId): Promise<Doc<'responses'>[]> => {
  const messages =  await db.query('responses').order("desc").filter((q) => q.eq(q.field("messageId"), messageId)).collect()

  for (const message of messages) {
    let id = message?.imageId;
    if (id && id.length > 0) {
      message.imageUrl = await storage.getUrl(id);
    }
  }
  return messages;
})
