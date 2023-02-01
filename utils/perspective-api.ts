interface IPerspectiveProps {
  debug?: boolean
}

export const Perspective = (props: IPerspectiveProps) => {
  const { debug } = props

  if (!process.env.PERSPECTIVE_API_KEY) {
    throw new Error('No perspective API key set')
  }

  const analyze = async (content: string) => {
    const url = new URL(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'
    )
    url.searchParams.set('key', process.env.PERSPECTIVE_API_KEY!)
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text: content },
        languages: ['en'],
        // https://support.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US
        requestedAttributes: {
          SPAM: {},
          SEVERE_TOXICITY: {},
          INSULT: {},
          SEXUALLY_EXPLICIT: {},
          IDENTITY_ATTACK: {},
          INFLAMMATORY: {},
        },
      }),
    })

    if (!resp.ok) {
      throw new Error(`Perspective API returned ${resp.status}`)
    }

    const data = await resp.json()

    if (debug) {
      console.log({ scores: JSON.stringify(data, null, 2) })
    }

    return data.attributeScores as {
      [key: string]: {
        summaryScore: {
          value: number
        }
      }
    }
  }

  return {
    analyze,
  }
}
