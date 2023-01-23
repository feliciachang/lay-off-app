import { useQuery } from '../../convex/_generated/react'
import UserMessageStream from './slow-message-stream'
import { useEffect } from 'react'
import styles from './index.module.css'
import useQuickQuestionForm from '../form/use-quick-question-form'
import Form from '../form/form'

interface TodaysQuickQuestionProps {
  roomId?: string
  displayAllResponses: boolean
  setDisplayAllResponses: (value: boolean) => void
  userHasResponded: boolean
  setUserHasResponded: (value: boolean) => void
}

interface IFormInput {
  quickQuestionText: string
  quickQuestionUrl: string
}

export default function TodaysQuickQuestion(props: TodaysQuickQuestionProps) {
  const {
    roomId,
    displayAllResponses,
    setDisplayAllResponses,
    userHasResponded,
    setUserHasResponded,
  } = props

  const {
    newMessageText,
    setNewMessageText,
    newMessageUrl,
    setNewMessageUrl,
    handleSendMessage,
    isValidUrl,
    success,
  } = useQuickQuestionForm(roomId ?? null)

  const messages = useQuery('listMessages', roomId || null, 'desc') || []
  const visibleMessages = displayAllResponses ? messages : messages.slice(0, 1)

  useEffect(() => {
    if (userHasResponded) {
      setDisplayAllResponses(true)
    }
  }, [userHasResponded])

  const sendQuickQuestion = useMutation('sendQuickQuestion')

  return (
    <div>
      {visibleMessages.map((message) => {
        return (
          <UserMessageStream
            key={message._id.toString()}
            id={message._id.toString()}
            url={message.url}
            body={message.body}
            creationTime={new Date(message._creationTime).toLocaleDateString()}
            userHasResponded={userHasResponded}
            setUserHasResponded={setUserHasResponded}
            displayAllResponses={displayAllResponses}
          />
        )
      })}
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
          {success && <p>ty! come again soon</p>}
        </div>
      )}
      {displayAllResponses && (
        <div className={styles.invitationFormContainer}>
          <div className={styles.invitationText}>
            Get tomorrow's question via email cause you an email hoe
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
          {success && <p>ty! come again soon</p>}
        </div>
      )}
    </div>
  )
}
