import { mutation } from './_generated/server'

export default mutation(
  async (
    { db },
    body: string,
    author: string,
    url: string,
    roomId: string | null
  ) => {
    const message = { body, author, url, roomId }
    const ret = await db.insert('messages', message)
    return ret
  }
)
