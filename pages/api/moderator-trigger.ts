// https://nextjs.org/docs/api-routes/introduction
import { Client } from '@upstash/qstash'
import { NextApiRequest, NextApiResponse } from 'next'
import { IApiResponse } from '../../utils'
import { IModeratorRequestBody } from './moderator-background-task'

// this function just tells QStash to ping us back
// this is done serverside to prevent leaking the QSTASH_TOKEN
const moderatorTriggerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: true })
  }

  const body = req.body as IModeratorRequestBody

  const qstash = new Client({
    token: process.env.QSTASH_TOKEN!,
  })

  const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for']

  const finalBody = {
    ...body,
    ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
  }

  // take a look at pages/api/moderator-background-task.ts
  await qstash.publishJSON({
    url: `https://${process.env.VERCEL_URL}/api/moderator-background-task`,
    body: finalBody,
  })

  return res.status(200).json({
    message: 'Moderation triggered',
    error: false,
    payload: finalBody,
  })
}

export default moderatorTriggerHandler