import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/router'
import ResponseBody from '../responses'
import Text from '../../design-system/text/text'
import styles from './message-stream.module.css'
import textAreaStyles from '../emails/textarea.module.css'
import cx from 'classnames'

interface MessageStreamProps {
  id: string
  body: string
  url: string
  creationTime: string
  addDate?: boolean
}

export function getPageId(roomid: string | string[] | undefined) {
  if (typeof roomid === 'string') {
    return roomid
  }
  return null
}

export default function MessageStream(props: MessageStreamProps) {
  const { id, body, url, addDate, creationTime } = props

  const router = useRouter()
  const { roomid } = router.query

  const roomInfo = useQuery('listRoom', getPageId(roomid))
  let roomName = roomInfo?.[0]?.name
  console.log(roomName)
  let order = roomName === 'laidoffonavisa' ? 'asc' : 'desc'

  const responses = useQuery('listResponses', id, order) || []

  const [numInitialResponses, setNumInitialResponses] = useState(5)

  return (
    <div className={styles.messageStreamContainer}>
      {addDate && <p>{creationTime}</p>}
      <div className={styles.messageStream}>
        <div className={styles.message}>
          <Text type="message" text={body} maxChar={250} url={url} />
        </div>
        <div className={styles.rightMessage}>
          <ResponseForm id={id} />
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

interface ResponseFormProps {
  id: string
}

function ResponseForm(props: ResponseFormProps): JSX.Element {
  const [showUrlForm, setShowUrlForm] = useState(false)
  const { id } = props
  const { user } = useUser()

  const sendResponse = useMutation('sendResponse')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  return (
    <div>
      <form
        className={textAreaStyles.form}
        onSubmit={handleSubmit(async (data) => {
          await sendResponse(
            id,
            data.newResponseText,
            '',
            data.newResponseUrl,
            user?.id ?? null
          )
          reset()
        })}
      >
        <textarea
          onClick={() => setShowUrlForm(true)}
          className={cx(textAreaStyles.textarea, {
            [textAreaStyles.taller]: showUrlForm,
          })}
          placeholder="join the club, add a reply"
          {...register('newResponseText', { required: true })}
        />
        {showUrlForm && (
          <div style={{ display: 'flex' }}>
            <input
              className={textAreaStyles.inputt}
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
