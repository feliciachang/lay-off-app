import { useQuery } from '../../convex/_generated/react'
import UserMessageStream from './slow-message-stream'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import useMessageForm from '../form/use-message-form'
import Form from '../form/form'
interface QuickQuestionProps {
  roomId?: string
}

export default function QuickQuestion(props: QuickQuestionProps) {
  const { roomId } = props

  const {
    newMessageText,
    setNewMessageText,
    newMessageUrl,
    setNewMessageUrl,
    handleSendMessage,
    isValidUrl,
  } = useMessageForm(roomId ?? null, false)

  const messages = useQuery('listMessages', roomId || null, false) || []
  const [userHasResponded, setUserHasResponded] = useState(false)
  const [displayAllResponses, setDisplayAllResponses] = useState(false)
  const visibleMessages = displayAllResponses ? messages : messages.slice(0, 1)

  useEffect(() => {
    if (userHasResponded) {
      setDisplayAllResponses(true)
    }
  }, [userHasResponded])

  return (
    <div className={styles.container}>
      {displayAllResponses ? (
        <p>thanks for joining the club. here's what other people said:</p>
      ) : (
        <p>quick question...</p>
      )}
      {visibleMessages.map((message) => (
        <UserMessageStream
          key={message._id.toString()}
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
          userHasResponded={userHasResponded}
          setUserHasResponded={setUserHasResponded}
          displayAllResponses={displayAllResponses}
        />
      ))}
      {displayAllResponses && (
        <div className={styles.invitationFormContainer}>
          <div className={styles.invitationText}>
            Contribute a question for next time:
          </div>
          <Form
            handleSendMessage={handleSendMessage}
            newResponseText={newMessageText}
            setNewResponseText={setNewMessageText}
            newResponseUrl={newMessageUrl}
            setNewResponseUrl={setNewMessageUrl}
            isValidUrl={isValidUrl}
          />
        </div>
      )}
    </div>
  )
}
