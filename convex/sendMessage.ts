import { mutation } from './_generated/server'

export default mutation(
  async (
    mutationCtx: any,
    body: string,
    author: string,
    url: string,
    roomId: string | null
  ) => {
    const message = { body, author, url, roomId }
    const ret = await mutationCtx.db.insert('messages', message)
    return ret
  }
)
