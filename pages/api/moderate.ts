import { LogSnag } from 'logsnag'
import { ConvexHttpClient } from 'convex/browser'
import deleteRowMutation from '../../convex/deleteRow'
import { moderator } from '../../tasks/moderator'

// OpenAI moderator reference:
// https://platform.openai.com/docs/guides/moderation/quickstart
interface IOpenAIModerationResponse {
  id: string
  model: string
  results: Array<{
    flagged: boolean
  }>
}

export default moderator.onReceive({
  job: async (payload) => {
    const { tableName, contents, serializedId, ipAddress } = payload

    //  make a call to the openapi moderation api
    let isFlagged = false

    try {
      const openAiReponse = await fetch(
        'https://api.openai.com/v1/moderations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ input: contents }),
        }
      )
      const openAiData: IOpenAIModerationResponse = await openAiReponse.json()
      isFlagged = openAiData.results.some((r) => r.flagged)
    } catch (e) {
      console.error(e)
      return {
        message:
          e instanceof Error ? `OpenAI failed: ${e.message}` : 'OpenAI failed',
        error: true,
      }
    }

    // return early if not flagged
    if (!isFlagged) {
      return {
        error: false,
        message: 'Not flagged by moderator',
      }
    }

    // then report to logsnag
    const logsnag = new LogSnag({
      token: process.env.LOGSNAG_TOKEN!,
      project: 'laid-off-club',
    })
    try {
      await logsnag.publish({
        channel: 'moderator',
        event: 'Content flagged by moderator',
        description: `Content flagged by moderator: ${contents}`,
        icon: '🙀',
        tags: {
          // note that tags must be lowercase
          // https://docs.logsnag.com/endpoints/log/tags
          'ip-address': ipAddress ?? 'unknown',
        },
      })
    } catch (e) {
      console.error(e)
      return {
        message:
          e instanceof Error
            ? `LogSnag failed: ${e.message}`
            : 'LogSnag failed',
        error: true,
      }
    }

    // delete from convex
    try {
      const convexClient = new ConvexHttpClient({
        address:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8187'
            : process.env.CONVEX_ADDRESS!,
      })
      await convexClient.mutation(deleteRowMutation.name)({
        tableName,
        serializedId,
      })
    } catch (e) {
      console.error(e)
      return {
        message:
          e instanceof Error ? `Convex failed: ${e.message}` : 'Convex failed',
        error: true,
      }
    }

    return {
      message:
        'Flagged by moderator. Reported via LogSnag and deleted from Convex',
      error: false,
    }
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}
