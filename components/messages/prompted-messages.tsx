import { useQuery } from '../../convex/_generated/react'
import { UserMessageStream } from './message-stream'
import { useEffect, useState } from 'react'

interface PromptedMessagesProps {
  roomId?: string
}

export default function PromptedMessages(props: PromptedMessagesProps) {
  const { roomId } = props

  const messages = useQuery('listMessages', roomId || null) || []
  const [displayNumMessages, setDisplayNumMessages] = useState(1)
  const [displayAllResponses, setDisplayAllResponses] = useState(false)

  useEffect(() => {
    if (displayNumMessages === messages.length - 1) {
      setDisplayAllResponses(true)
    }
  }, [])

  return (
    <div>
      {messages.slice(displayNumMessages).map((message) => (
        <UserMessageStream
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
          displayNumMessages={displayNumMessages}
          setDisplayNumMessages={setDisplayNumMessages}
        />
      ))}
    </div>
  )
}
