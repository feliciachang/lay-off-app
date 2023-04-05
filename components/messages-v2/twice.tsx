import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import ResponseBody from '../responses'
import styles from './twice.module.css'
import Image from 'next/image'

interface TwiceProps {
  roomId: string
}
export default function Twice(props: TwiceProps): JSX.Element {
  const { roomId } = props
  const [activeMessageId, setActiveMessageId] = useState('')
  const [showResponses, setShowResponses] = useState(false)

  const messages = useQuery('listMessages', roomId ?? null, 'asc') || []

  return (
    <div style={{ margin: '10px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((message) => (
            <Messages
              body={message.body}
              time={message.time}
              messageId={message._id.toString()}
              details={message.details}
              url={message.url}
              setActiveMessageId={setActiveMessageId}
              setShowResponses={setShowResponses}
              showResponse={showResponses}
            />
          ))}
        </div>
        {showResponses && (
          <div style={{ height: '100%', overflowY: 'scroll' }}>
            <ResponseForm messageId={activeMessageId} />
            <Responses messageId={activeMessageId} />
          </div>
        )}
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
  setActiveMessageId: (messageId: string) => void
  setShowResponses: (showResponse: boolean) => void
  showResponse: boolean
}

export function Messages(props: MessagesProps): JSX.Element {
  const {
    body,
    details,
    time,
    url,
    messageId,
    setActiveMessageId,
    showResponse,
    setShowResponses,
  } = props
  const [showAnd, setShowAnd] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: `${showAnd ? 'center' : 'flex-start'}`,
      }}
    >
      <div
        className={styles.text}
        style={{
          width: '500px',
          padding: '10px',
          marginBottom: '30px',
        }}
        onClick={() => {
          setShowAnd(false)
          setShowResponses(!showResponse)
          setActiveMessageId(messageId)
        }}
        onMouseEnter={() => {
          if (!showResponse) setShowAnd(true)
        }}
        onMouseLeave={() => {
          if (!showResponse) setShowAnd(false)
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
        <div
          style={{
            fontSize: '100px',
            color: 'blue',
            paddingLeft: '5px',
          }}
        >
          &
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
