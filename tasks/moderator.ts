import { Scheduler } from 'bunnygram'
import { TableNames } from '../convex/_generated/dataModel'

export interface IModeratorJobPayload {
  tableName: TableNames
  serializedId: string
  contents: string
  ipAddress?: string
}

export interface IModeratorJobResponse {
  message: string
  error: boolean
}

export const moderator = Scheduler<IModeratorJobPayload, IModeratorJobResponse>(
  {
    route: '/api/moderate',
    config: {
      baseUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    },
  }
)
