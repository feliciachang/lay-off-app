import { useQuery, useMutation } from '../../convex/_generated/react'
import UserMessageStream from './slow-message-stream'
import { useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import formStyles from '../emails/form.module.css'
import { useForm } from 'react-hook-form'
import cx from 'classnames'

interface TodaysQuickQuestionProps {
  roomId?: string
  displayAllResponses: boolean
  setDisplayAllResponses: (value: boolean) => void
  userHasResponded: boolean
  setUserHasResponded: (value: boolean) => void
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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const sendQuickQuestion = useMutation('sendQuickQuestion')
  const messages = useQuery('listMessages', roomId || null, 'desc') || []
  const visibleMessages = displayAllResponses ? messages : messages.slice(0, 1)

  useEffect(() => {
    if (userHasResponded) {
      setDisplayAllResponses(true)
    }
  }, [userHasResponded])

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
          <form
            className={formStyles.messageForm}
            onSubmit={handleSubmit(async (data) => {
              await sendQuickQuestion(
                data.newMessageText,
                data.newMessageUrl,
                roomId || null
              )
              reset()
            })}
          >
            <textarea
              className={formStyles.formInput}
              placeholder="join the club, add a reply"
              {...register('newMessageText', { required: true })}
            />
            <textarea
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
      )}
    </div>
  )
}
