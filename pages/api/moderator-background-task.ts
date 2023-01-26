// https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from '@upstash/qstash/nextjs'
import { LogSnag } from 'logsnag'

// since this code is run server side, we need to use the non-React version of Convex
import { ConvexHttpClient } from 'convex/browser'
import deleteRowMutation from '../../convex/deleteRow'
import { TableNames } from '../../convex/_generated/dataModel'
import { IApiResponse } from '../../utils'

export interface IModeratorRequestBody {
  tableName: TableNames
  serializedId: string
  contents: string
  ipAddress?: string
}

interface IOpenAIModerationResponse {
  id: string
  model: string
  results: Array<{
    flagged: boolean
  }>
}

const moderatorBackgroundTaskHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse>
) => {
  // only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: true })
  }

  // get the comment from request body
  const { tableName, serializedId, contents, ipAddress } =
    req.body as IModeratorRequestBody

  //  make a call to the openapi moderation api
  const openAiReponse = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input: contents }),
  })
  const openAiData: IOpenAIModerationResponse = await openAiReponse.json()
  const isFlagged = openAiData.results.some((r) => r.flagged)

  // if not flagged, return as normal
  if (!isFlagged) {
    return res.status(200).json({
      message: 'Not flagged by moderator',
      error: false,
    })
  }

  // then report to logsnag
  const logsnag = new LogSnag({
    token: process.env.LOGSNAG_TOKEN!,
    project: 'laid-off-club',
  })
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

  // otherwise, first delete from convex
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
    console.error('Convex failed: ', e)
  }

  // return
  return res.status(200).json({
    message:
      'Flagged by moderator. Reported via LogSnag and deleted from Convex',
    error: false,
  })
}

// the verify signature wrapper will verify the signature of the request
// it relies on the QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY
// environment variables to be present
export default verifySignature(moderatorBackgroundTaskHandler)

// disable body parsing for this route
// this is required for the verifySignature wrapper to work
// fortunately, the wrapper will parse and forward the body to our handler
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
}