import Image from 'next/image'
import Form from '../form/form'
import { useState, FormEvent } from 'react'
import { useQuery } from '../../convex/_generated/react'
import styles from './slow-message-stream.module.css'
import { useMutation } from '../../convex/_generated/react'
import { MessageBody, ResponseBody } from '../messages/message-stream'
import { validURL } from '../../utils'

interface UserMessageStreamProps {
  id: string
  body: string
  url: string
  creationTime: string
  userHasResponded: boolean
  setUserHasResponded: (value: boolean) => void
  displayAllResponses: boolean
}

export default function UserMessageStream(props: UserMessageStreamProps) {
  const {
    id,
    body,
    url,
    userHasResponded,
    setUserHasResponded,
    displayAllResponses,
    creationTime,
  } = props

  const responses = useQuery('listResponses', id) || []

  const [numInitialResponses, setNumInitialResponses] = useState(20)

  const [newResponseText, setNewResponseText] = useState('')
  const [newResponseUrl, setNewResponseUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const sendResponse = useMutation('sendResponse')

  async function handleSendResponse(event: FormEvent) {
    event.preventDefault()
    if (newResponseUrl.length > 0 && !validURL(newResponseUrl)) {
      setIsValidUrl(false)
      return
    }
    setUserHasResponded(true)
    await sendResponse(id, newResponseText, '', newResponseUrl)
  }

  return (
    <div className={styles.messageStreamContainer}>
      {displayAllResponses && (
        <p className={styles.creationTime}>{creationTime}</p>
      )}
      <div className={styles.messageStream}>
        <div className={styles.centerMessageBody}>
          <MessageBody body={body} url={url} />
        </div>
        <div>
          {!userHasResponded && (
            <Form
              handleSendMessage={handleSendResponse}
              newResponseText={newResponseText}
              textPlaceholder={
                displayAllResponses
                  ? 'join the club, add to the past'
                  : 'join the club, add a reply'
              }
              setNewResponseText={setNewResponseText}
              newResponseUrl={newResponseUrl}
              setNewResponseUrl={setNewResponseUrl}
              isValidUrl={isValidUrl}
            />
          )}
          {!displayAllResponses ? (
            <ResponseBody
              body={newResponseText}
              url=""
              numInitialResponses={0}
              responsesLength={0}
            />
          ) : (
            <div className={styles.allResponses}>
              {responses.slice(0, numInitialResponses).map((response, i) => (
                <ResponseBody
                  key={response._id.toString()}
                  body={response.body}
                  url={response.url}
                  numInitialResponses={numInitialResponses}
                  responsesLength={responses.length}
                  idx={i}
                />
              ))}
              {numInitialResponses < responses.length && (
                <div className={styles.readMoreResponses}>
                  <div
                    className={styles.readMore}
                    onClick={(): void =>
                      setNumInitialResponses(responses.length)
                    }
                  >
                    read more responses
                  </div>
                  <Image
                    className={styles.expand}
                    src="/expand.svg"
                    alt="expand"
                    width={15}
                    height={15}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
