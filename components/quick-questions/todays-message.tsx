import { useQuery } from '../../convex/_generated/react'
import UserMessageStream from './slow-message-stream'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import useMessageForm from '../form/use-message-form'
import Form from '../form/form'
interface TodaysQuickQuestionProps {
  roomId?: string
}

export default function TodaysQuickQuestion(props: TodaysQuickQuestionProps) {
  const { roomId } = props

  const {
    newMessageText,
    setNewMessageText,
    newMessageUrl,
    setNewMessageUrl,
    handleSendMessage,
    isValidUrl,
  } = useMessageForm(roomId ?? null)

  const [displayAllResponses, setDisplayAllResponses] = useState(false)
  const messages = useQuery('listMessages', roomId || null, 'desc') || []
  const [userHasResponded, setUserHasResponded] = useState(false)
  const visibleMessages = displayAllResponses ? messages : messages.slice(0, 1)

  useEffect(() => {
    if (userHasResponded) {
      setDisplayAllResponses(true)
    }
  }, [userHasResponded])

  return (
    <div>
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
            Contribute a question for next time.
          </div>
          <Form
            handleSendMessage={handleSendMessage}
            newResponseText={newMessageText}
            setNewResponseText={setNewMessageText}
            newResponseUrl={newMessageUrl}
            setNewResponseUrl={setNewMessageUrl}
            textPlaceholder="join the club, add a question"
            isValidUrl={isValidUrl}
            autoOpen={true}
          />
        </div>
      )}
    </div>
  )
}
