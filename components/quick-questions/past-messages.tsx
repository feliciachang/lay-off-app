import { useQuery } from '../../convex/_generated/react'
import MessageStream from '../messages/message-stream'
import styles from './index.module.css'
import useMessageForm from '../form/use-message-form'
import Form from '../form/form'
interface PastQuickQuestionProps {
  roomId?: string
}

export default function PastQuickQuestion(props: PastQuickQuestionProps) {
  const { roomId } = props

  const {
    newMessageText,
    setNewMessageText,
    newMessageUrl,
    setNewMessageUrl,
    handleSendMessage,
    isValidUrl,
  } = useMessageForm(roomId ?? null, false)

  const messages = useQuery('listMessages', roomId || null, true) || []

  return (
    <div>
      {messages.map((message) => (
        <MessageStream
          addDate
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
      ))}
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
    </div>
  )
}
