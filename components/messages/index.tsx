import { useQuery, useMutation } from '../../convex/_generated/react'
import styles from './index.module.css'
import Image from 'next/image'
import textAreaStyles from '../emails/textarea.module.css'
import MessageStream from './message-stream'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import cx from 'classnames'

interface MessagesProps {
  roomId: string | null
  messageLabel?: string
}
export default function Messages(props: MessagesProps) {
  const { roomId, messageLabel } = props
  const messages = useQuery('listMessages', roomId ?? null, 'asc') || []

  return (
    <div>
      {messages.slice(0, 3).map((message) => (
        <MessageStream
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
        />
      ))}
      {messages.length > 3 && (
        <div
          className={cx(styles.notif, {
            [styles.buttonVersion]: !roomId,
          })}
          onClick={() => {
            if (!roomId) {
              window.scrollTo(0, document.body.scrollHeight)
            }
          }}
        >
          <span className={styles.label}>
            ask a new question, tell a story or just your feelings, it's a
            party.
          </span>
          <MessageForm id={roomId} shouldScrollToBottom={true} />
        </div>
      )}
      {messages.slice(3).map((message) => (
        <MessageStream
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
        />
      ))}
      <div className={styles.invitationFormContainer}>
        <div className={styles.invitationText}>
          {messageLabel
            ? messageLabel
            : `Laid off too? Add a message, or just ur feelings. It's a party.`}
        </div>
        <MessageForm id={roomId} />
      </div>
    </div>
  )
}

interface MessageFormProps {
  id?: string | null
  shouldScrollToBottom?: boolean
}

function MessageForm(props: MessageFormProps): JSX.Element {
  const [showUrlForm, setShowUrlForm] = useState(false)
  const { id, shouldScrollToBottom } = props

  const { user } = useUser()

  const sendMessage = useMutation('sendMessage')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  if (!id) {
    return <></>
  }

  return (
    <div>
      <form
        className={textAreaStyles.form}
        onSubmit={handleSubmit(async (data) => {
          console.log(data.newMessageText)
          if (!data.newMessageText) {
            return
          }
          await sendMessage(
            data.newMessageText,
            '',
            data.newMessageUrl ?? '',
            id || null,
            null,
            null,
            user?.id ?? null
          )
          reset()
          if (shouldScrollToBottom) {
            window.scrollTo(0, document.body.scrollHeight)
          }
        })}
      >
        <textarea
          onClick={() => setShowUrlForm(true)}
          className={cx(textAreaStyles.textarea, {
            [textAreaStyles.taller]: showUrlForm,
          })}
          placeholder="join the club, add a reply"
          {...register('newMessageText', { required: true })}
        />
        {showUrlForm && (
          <div style={{ display: 'flex' }}>
            <input
              className={textAreaStyles.inputt}
              placeholder="and a url, if necessary"
              {...register('newMessageUrl', {
                pattern: {
                  value: new RegExp(
                    '^(https?:\\/\\/)?' + // protocol
                      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                      '(\\#[-a-z\\d_]*)?$',
                    'i'
                  ),
                  message: 'invalid url',
                },
              })}
            />
            <button className={textAreaStyles.button} type="submit">
              <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
            </button>
          </div>
        )}
      </form>
      {errors.newResponseText && <p>please write a message first!</p>}
      {errors.newResponseUrl && <p>not a valid url!</p>}
    </div>
  )
}
