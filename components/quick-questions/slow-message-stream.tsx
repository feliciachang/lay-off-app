import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useState, FormEvent } from 'react'
import { useQuery } from '../../convex/_generated/react'
import styles from './slow-message-stream.module.css'
import { useMutation } from '../../convex/_generated/react'
import { MessageBody } from '../messages/message-stream'
import ResponseBody from '../responses'
import formStyles from '../emails/form.module.css'
import { validURL } from '../../utils'
import cx from 'classnames'

interface UserMessageStreamProps {
  id: string
  body: string
  url: string
  creationTime: string
  userHasResponded: boolean
  setUserHasResponded: (value: boolean) => void
  displayAllResponses: boolean
}

export default function UserMessageStream(props: UserMessageStreamProps) {
  const {
    id,
    body,
    url,
    userHasResponded,
    setUserHasResponded,
    displayAllResponses,
    creationTime,
  } = props

  const responses = useQuery('listResponses', id) || []

  const [numInitialResponses, setNumInitialResponses] = useState(20)

  const [newResponseText, setNewResponseText] = useState('')
  const [newResponseUrl, setNewResponseUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const sendResponse = useMutation('sendResponse')

  async function handleSendResponse(event: FormEvent) {
    event.preventDefault()
    if (newResponseUrl.length > 0 && !validURL(newResponseUrl)) {
      setIsValidUrl(false)
      return
    }
    setUserHasResponded(true)
    await sendResponse(id, newResponseText, '', newResponseUrl)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  return (
    <div className={styles.messageStreamContainer}>
      {displayAllResponses && (
        <p className={styles.creationTime}>{creationTime}</p>
      )}
      <div className={styles.messageStream}>
        <div className={styles.centerMessageBody}>
          <MessageBody body={body} url={url} />
        </div>
        <div>
          {!userHasResponded && (
            <form
              className={formStyles.messageForm}
              onSubmit={handleSubmit(async (data) => {
                if (
                  newResponseUrl.length > 0 &&
                  !validURL(data.newResponseUrl)
                ) {
                  setIsValidUrl(false)
                  return
                }
                setUserHasResponded(true)
                await sendResponse(
                  id,
                  data.newResponseText,
                  '',
                  data.newResponseUrl
                )
                reset()
              })}
            >
              <textarea
                className={formStyles.formInput}
                placeholder="join the club, add a reply"
                {...register('newResponseText', { required: true })}
              />
              <textarea
                className={cx(formStyles.formInput, formStyles.addMargin)}
                placeholder="and a url, if necessary"
                {...register('newResponseUrl', {
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
          )}
          {!displayAllResponses ? (
            <ResponseBody
              body={newResponseText}
              url=""
              numInitialResponses={0}
              responsesLength={0}
            />
          ) : (
            <div className={styles.allResponses}>
              {responses.slice(0, numInitialResponses).map((response, i) => (
                <ResponseBody
                  key={response._id.toString()}
                  body={response.body}
                  url={response.url}
                  numInitialResponses={numInitialResponses}
                  responsesLength={responses.length}
                  idx={i}
                />
              ))}
              {numInitialResponses < responses.length && (
                <div className={styles.readMoreResponses}>
                  <div
                    className={styles.readMore}
                    onClick={(): void =>
                      setNumInitialResponses(responses.length)
                    }
                  >
                    read more responses
                  </div>
                  <Image
                    className={styles.expand}
                    src="/expand.svg"
                    alt="expand"
                    width={15}
                    height={15}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
