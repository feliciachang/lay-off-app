import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import ResponseBody from '../responses'
import styles from './twice.module.css'
import Image from 'next/image'
import { ResponseForm } from '../messages/message-stream'
import cx from 'classnames'

interface TwiceProps {
  roomId: string
}
export default function Twice(props: TwiceProps): JSX.Element {
  const { roomId } = props
  const [activeIdx, setActiveIdx] = useState(0)

  const messages = useQuery('listMessages', roomId ?? null, 'asc') || []

  const emojis = [
    '/emojis/1.svg',
    '/emojis/5.svg',
    '/emojis/2.svg',
    '/emojis/3.svg',
  ]

  return (
    <div className={styles.background}>
      <div className={styles.timeline}>
        {messages.map((message, i) => (
          <div
            className={cx(styles.timelineTab, {
              [styles.active]: activeIdx === i,
            })}
            onClick={() => setActiveIdx(i)}
          >
            <div className={styles.timelineTime}>{message.time}</div>
            <Image
              style={{ marginRight: '10px', fill: 'blue' }}
              src={emojis[i % 4]}
              alt="emoji"
              width={70}
              height={50}
            />
          </div>
        ))}
        <button>+ write your own story</button>
      </div>
      {messages[activeIdx] && (
        <div className={styles.activeStory}>
          <div>
            <div className={styles.mainText}>{messages[activeIdx]?.body}</div>
            <div style={{ fontSize: '20px', paddingBottom: '30px' }}>
              {messages[activeIdx]?.details}
            </div>
            <ResponseForm yellow id={messages[activeIdx]?._id?.toString()} />
            <Responses messageId={messages[activeIdx]?._id?.toString()} />
          </div>
          <button onClick={() => setActiveIdx(activeIdx + 1)}>
            <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
          </button>
        </div>
      )}
    </div>
  )
}

interface MessagesProps {
  body: string
  details: string | null
  time: string | null
  url: string
  messageId: string
  idx: number
  activeIdx: number
  setActiveIdx: (idx: number) => void
}

export function Messages(props: MessagesProps): JSX.Element {
  const { body, details, time, url, messageId, idx, activeIdx, setActiveIdx } =
    props

  const emojis = [
    '/emojis/1.svg',
    '/emojis/5.svg',
    '/emojis/2.svg',
    '/emojis/3.svg',
  ]

  return (
    <div
      style={{
        padding: '10px',
        minHeight: '100vh',
        maxWidth: '80vw',
      }}
      className={styles.text}
      onClick={() => setActiveIdx(idx)}
      // onMouseEnter={() => {
      //   setShowAnd(true)
      // }}
      // onMouseLeave={() => {
      //   setShowAnd(false)
      // }}
    >
      {/* {idx === activeIdx && (
        <> */}
      <div
        style={{
          marginBottom: '30px',
          minWidth: '500px',
        }}
      >
        <div style={{ marginBottom: '10px' }}>{body}</div>
        <div style={{ fontSize: '18px' }}>{details}</div>
      </div>
      <div>
        {/* <div
            style={{
              fontSize: '100px',
              color: 'blue',
              display: 'flex',
            }}
          >
            {emojis.map((emoji) => (
              <Image
                style={{ marginRight: '10px', fill: 'blue' }}
                src={emoji}
                alt="emoji"
                width={70}
                height={50}
              />
            ))}
          </div> */}
        <ResponseForm id={messageId} />
        <Responses messageId={messageId} />
      </div>
      {/* </>
      )} */}
    </div>
  )
}

interface ResponsesProps {
  messageId: string
}

export function Responses(props: ResponsesProps): JSX.Element {
  const { messageId } = props

  const responses = useQuery('listResponses', messageId, 'desc') || []

  return (
    <div>
      {responses.map((response, i) => (
        <ResponseBody
          key={response._id.toString()}
          id={response._id.toString()}
          body={response.body}
          url={response.url}
          numInitialResponses={200}
          responsesLength={responses.length}
          idx={i}
        />
      ))}
    </div>
  )
}

interface DetailedMessageFormProps {
  roomId: string
}
export function DetailedMessageForm(
  props: DetailedMessageFormProps
): JSX.Element {
  const { roomId } = props
  const { register, handleSubmit, reset } = useForm()
  const { user } = useUser()

  const sendMessage = useMutation('sendMessage')

  return (
    <form
      className={styles.messageForm}
      onSubmit={handleSubmit(async (data) => {
        await sendMessage(
          data.newMessageText,
          '',
          data.newMessageUrl,
          roomId ?? null,
          data.newMessageDetails ?? null,
          data.newMessageDate ?? null,
          user?.id ?? null
        )
        reset()
      })}
    >
      <input
        className={styles.formInput}
        placeholder="set a time frame"
        {...register('newMessageDate')}
      />
      <input
        className={styles.formInput}
        placeholder="what's the tldr"
        {...register('newMessageText', { required: true })}
      />
      <textarea
        className={styles.formInput}
        placeholder="say more..."
        {...register('newMessageDetails')}
      />
      <input
        className={styles.formInput}
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
      <button className={styles.submitButton} type="submit">
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
    </form>
  )
}
