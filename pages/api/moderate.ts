import { LogSnag } from 'logsnag'
import { ConvexHttpClient } from 'convex/browser'
import { moderator } from '../../tasks/moderator'
import { encodeBase64 } from '../../utils'
import { Velocity } from 'velocity-api'

export default moderator.onReceive({
  job: async (payload) => {
    const { tableName, contents, serializedId, ipAddress } = payload

    if (!process.env.LOGSNAG_TOKEN || !process.env.PERSPECTIVE_API_KEY) {
      return {
        message: 'Either LogSnag or Perspective env vars not set',
        error: true,
      }
    }

    let isFlagged = false

    // make a call to the perspective api
    try {
      const perspective = new Velocity(process.env.PERSPECTIVE_API_KEY)
      const scores = await perspective.processMessage(contents, {
        // https://support.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US
        attributes: [
          'SPAM',
          'SEVERE_TOXICITY',
          'INSULT',
          'SEXUALLY_EXPLICIT',
          'IDENTITY_ATTACK',
          'INFLAMMATORY',
        ],
        languages: ['en'],
        doNotStore: true,
      })
      if (Object.values(scores).some((prob) => prob > 0.8)) {
        isFlagged = true
      }
    } catch (e) {
      console.error(e)
      return {
        message:
          e instanceof Error
            ? `Perspective failed: ${e.message}`
            : 'Perspective failed',
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
      token: process.env.LOGSNAG_TOKEN,
      project: 'laid-off-club',
    })
    try {
      await logsnag.publish({
        channel: 'moderator',
        event: 'Content flagged by moderator',
        description: `Content flagged by moderator: ${encodeBase64(contents)}`,
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
      await convexClient.mutation('deleteRow')({
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
