import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import ResponseBody from '../responses'
import styles from './twice.module.css'
import Image from 'next/image'
import cx from 'classnames'

interface TwiceProps {
  roomId: string
}
export default function Twice(props: TwiceProps): JSX.Element {
  const { roomId } = props

  const messages = useQuery('listMessages', roomId ?? null, 'asc') || []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {messages.map((message) => (
          <Messages
            body={message.body}
            time={message.time}
            messageId={message._id.toString()}
            details={message.details}
            url={message.url}
          />
        ))}
        {/* {showResponses && (
          <div>
            <ResponseForm messageId={activeMessageId} />
            <Responses messageId={activeMessageId} />
          </div>
        )} */}
      </div>
      <DetailedMessageForm roomId={roomId} />
    </div>
  )
}

interface MessagesProps {
  body: string
  details: string | null
  time: string | null
  url: string
  messageId: string
}

export function Messages(props: MessagesProps): JSX.Element {
  const { body, details, time, url, messageId } = props
  const [showAnd, setShowAnd] = useState(false)

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
        minWidth: '70vw',
        maxWidth: '700px',
      }}
      className={styles.text}
      onMouseEnter={() => {
        setShowAnd(true)
      }}
      onMouseLeave={() => {
        setShowAnd(false)
      }}
    >
      <div
        style={{
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            marginBottom: '10px',
          }}
        >
          {time}
        </div>
        <div style={{ marginBottom: '10px' }}>{body}</div>
        <div style={{ fontSize: '18px' }}>{details}</div>
      </div>
      {showAnd && (
        <div>
          <ResponseForm messageId={messageId} />

          <div
            style={{
              fontSize: '100px',
              color: 'blue',
              paddingLeft: '30px',
              display: 'flex',
            }}
          >
            {emojis.map((emoji) => (
              <Image
                style={{ marginRight: '10px', fill: 'blue' }}
                src={emoji}
                alt="emoji"
                width={100}
                height={70}
              />
            ))}
          </div>
          <Responses messageId={messageId} />
        </div>
      )}
    </div>
  )
}

interface ResponseFormProps {
  messageId: string
}

export function ResponseForm(props: ResponseFormProps): JSX.Element {
  const { messageId } = props

  const { register, handleSubmit, reset } = useForm()
  const { user } = useUser()
  const sendResponse = useMutation('sendResponse')

  return (
    <form
      className={styles.messageForm}
      onSubmit={handleSubmit(async (data) => {
        await sendResponse(
          messageId,
          data.newResponseText,
          user?.id || '',
          data.newResponseUrl
        )
        reset()
      })}
    >
      <input
        className={styles.formInput}
        placeholder="join the club, add a reply"
        {...register('newResponseText', { required: true })}
      />
      <input
        className={styles.formInput}
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
      <button className={styles.submitButton} type="submit">
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
    </form>
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
          user?.id ?? '',
          data.newMessageUrl,
          roomId ?? null,
          data.newMessageDetails ?? null,
          data.newMessageDate ?? null
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
