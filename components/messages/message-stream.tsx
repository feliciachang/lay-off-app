import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/router'
import ResponseBody from '../responses'
import Text from '../../design-system/text/text'
import styles from './message-stream.module.css'
import formStyles from '../emails/form.module.css'
import cx from 'classnames'

interface MessageStreamProps {
  id: string
  body: string
  url: string
  creationTime: string
  addDate?: boolean
}

export default function MessageStream(props: MessageStreamProps) {
  const { id, body, url, addDate, creationTime } = props

  const { user } = useUser()

  const router = useRouter()
  const { roomid } = router.query
  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return null
  }
  const roomInfo = useQuery('listRoom', getPageId(roomid))
  let roomName = roomInfo?.[0]?.name
  let order = roomName === 'workingonavisa' ? 'asc' : 'desc'

  const responses = useQuery('listResponses', id, order) || []
  const sendResponse = useMutation('sendResponse')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [numInitialResponses, setNumInitialResponses] = useState(5)

  return (
    <div className={styles.messageStreamContainer}>
      {addDate && <p>{creationTime}</p>}
      <div className={styles.messageStream}>
        <div className={styles.message}>
          <Text type="message" text={body} maxChar={250} url={url} />
        </div>
        <div className={styles.rightMessage}>
          <form
            className={formStyles.messageForm}
            onSubmit={handleSubmit(async (data) => {
              await sendResponse(
                id,
                data.newResponseText,
                user?.id || '',
                data.newResponseUrl
              )
              reset()
            })}
          >
            <input
              className={formStyles.formInput}
              placeholder="join the club, add a reply"
              {...register('newResponseText', { required: true })}
            />
            <input
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
          {errors.newResponseText && <p>please write a message first!</p>}
          {errors.newResponseUrl && <p>not a valid url!</p>}
          <div>
            {responses.slice(0, numInitialResponses).map((response, i) => (
              <ResponseBody
                key={response._id.toString()}
                id={response._id.toString()}
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
                  onClick={(): void => setNumInitialResponses(responses.length)}
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
        </div>
      </div>
    </div>
  )
}
