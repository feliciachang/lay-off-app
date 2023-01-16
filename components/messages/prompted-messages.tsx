import { useQuery } from '../../convex/_generated/react'
import { useState } from 'react'
import Form from '../form/form'
import { MessageBody } from './message-stream'
import styles from 'message-stream.module.css'

interface PromptedMessagesProps {
  roomId?: string
}

export default function PromptedMessages(props: PromptedMessagesProps) {
  const { roomId } = props

  const messages = useQuery('listMessages', roomId || null) || []

  const [numMessages, setNumMessages] = useState(1)

  return (
    <div>
      {messages.slice(numMessages).map((message) => (
        <MessageBody body={message.body} url={message.url} />
      ))}
      <div className={styles.rightMessage}>
        <Form
          handleSendMessage={handleSendResponse}
          newResponseText={newResponseText}
          setNewResponseText={setNewResponseText}
          newResponseUrl={newResponseUrl}
          setNewResponseUrl={setNewResponseUrl}
          isValidUrl={isValidUrl}
        />
        <div>
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
                onClick={(): void => setNumInitialResponses(responses.length)}
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
      </div>
    </div>
  )
}
