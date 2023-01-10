import Form from '../form/form'
import { useQuery } from '../../convex/_generated/react'
import styles from './index.module.css'
import useMessageForm from '../form/use-message-form'
import MessageStream from './message-stream'

export default function Messages() {
  const messages = useQuery('listMessages') || []

  const {
    newMessageText,
    setNewMessageText,
    newMessageUrl,
    setNewMessageUrl,
    handleSendMessage,
    isValidUrl,
  } = useMessageForm()

  return (
    <div>
      {messages.map((message) => (
        <MessageStream
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
        />
      ))}
      {messages.length > 0 && (
        <div className={styles.invitationFormContainer}>
          <div className={styles.invitationText}>
            Laid off too? Add a message, or just ur feelings. It's a party.
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
