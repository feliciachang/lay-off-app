import { useQuery, useMutation } from '../../convex/_generated/react'
import styles from './index.module.css'
import Image from 'next/image'
import formStyles from '../form/Form.module.css'
import MessageStream from './message-stream'
import { useForm } from 'react-hook-form'
import cx from 'classnames'

interface MessagesProps {
  roomId: string | null
  messageLabel?: string
}
export default function Messages(props: MessagesProps) {
  const { roomId, messageLabel } = props

  const messages = useQuery('listMessages', roomId ?? null, 'asc') || []
  const sendMessage = useMutation('sendMessage')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

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
      <div className={styles.invitationFormContainer}>
        <div className={styles.invitationText}>
          {messageLabel
            ? messageLabel
            : `Laid off too? Add a message, or just ur feelings. It's a party.`}
        </div>
        <form
          className={formStyles.messageForm}
          onSubmit={handleSubmit(async (data) => {
            await sendMessage(
              data.newMessageText,
              '',
              data.newMessageUrl,
              roomId || null
            )
            reset()
          })}
        >
          <input
            className={formStyles.formInput}
            placeholder="join the club, add a reply"
            {...register('newMessageText', { required: true })}
          />
          <input
            className={cx(formStyles.formInput, formStyles.addMargin)}
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
          <button className={formStyles.submitButton} type="submit">
            <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
          </button>
        </form>
        {errors.newMessageText && <p>please write a message first!</p>}
        {errors.newMessageUrl && <p>not a valid url!</p>}
        {isSubmitSuccessful && <p>ty! come again soon</p>}
      </div>
    </div>
  )
}
