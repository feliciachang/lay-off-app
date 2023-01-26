import { IModeratorRequestBody } from '../pages/api/moderator-background-task'

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

export function redirectURL(url: string) {
  if (url?.length > 0) {
    if (url.slice(0, 8) !== 'https://') {
      window.open('https://' + url, '_blank')
    }
    window.open(url, '_blank')
  }
}

export function formatURL(url: string) {
  if (url.slice(0, 8) !== 'https://') {
    return 'https://' + url
  }
  return url
}

export interface IApiResponse {
  message: string
  error: boolean
  payload?: Record<string, any>
}

// function that can be used in the client
export const sendToModerator = async (props: IModeratorRequestBody) => {
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/moderator-trigger`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    }
  )
  const data: IApiResponse = await response.json()
  return data
}
