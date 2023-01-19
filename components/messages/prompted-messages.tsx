import { useQuery } from '../../convex/_generated/react'
import UserMessageStream from './slow-message-stream'
import { useEffect, useState } from 'react'
import styles from './prompted-messages.module.css'
interface PromptedMessagesProps {
  roomId?: string
}

export default function PromptedMessages(props: PromptedMessagesProps) {
  const { roomId } = props

  const messages = useQuery('listMessages', roomId || null) || []
  const [displayNumMessages, setDisplayNumMessages] = useState(1)
  const [displayAllResponses, setDisplayAllResponses] = useState(false)
  console.log(displayNumMessages, messages.length)
  useEffect(() => {
    if (messages.length > 0 && displayNumMessages > messages.length) {
      setDisplayAllResponses(true)
    }
  }, [displayNumMessages, messages.length])
  console.log(messages)
  return (
    <div className={styles.container}>
      {displayAllResponses ? (
        <p>thanks for joining the club today. here's what other people said:</p>
      ) : (
        <p>
          this is a question. the question changes everyday. today, we're
          wondering...
        </p>
      )}
      {messages.slice(0, displayNumMessages).map((message) => (
        <UserMessageStream
          key={message._id.toString()}
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
          displayNumMessages={displayNumMessages}
          setDisplayNumMessages={setDisplayNumMessages}
          displayAllResponses={displayAllResponses}
        />
      ))}
    </div>
  )
}
