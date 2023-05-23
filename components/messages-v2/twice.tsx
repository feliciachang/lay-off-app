import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import ResponseBody from '../responses'
import styles from './twice.module.css'
import Image from 'next/image'
import { ResponseForm } from '../messages/message-stream'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { F } from '@happykit/flags/dist/types-8f3bbdea'

interface FormattedLabelProps {
  text?: string
}
function FormattedLabel(props: FormattedLabelProps): JSX.Element {
  const { text } = props
  if (!text) return <></>
  let splitText = text.split(' ')
  return (
    <div className={styles.timelineTime}>
      {text}
      {/* <div>{splitText[0]}</div>
      <div>
        {splitText[1]} {splitText[2]}
      </div> */}
    </div>
  )
}
interface TwiceProps {
  roomId: string
}
export default function Twice(props: TwiceProps): JSX.Element {
  const { roomId } = props
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRefs = useRef<Array<HTMLDivElement>>([])
  const { push } = useRouter()
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
            onClick={() => {
              setActiveIdx(i)
            }}
            ref={(ref) => (sectionRefs.current[i] = ref as HTMLDivElement)}
          >
            {/* <div className={styles.timelineTime}>{message.time}</div> */}
            <FormattedLabel text={message.time ?? undefined} />
            <Image
              style={{ marginRight: '10px', fill: 'blue' }}
              src={emojis[i % 4]}
              alt="emoji"
              width={70}
              height={50}
            />
          </div>
        ))}
        <button className={styles.write} onClick={() => push('/create')}>
          write
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
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
          </div>
        )}
        {messages[activeIdx] && (
          <button
            className={styles.nextArrow}
            onClick={() => {
              if (activeIdx + 1 > messages.length) {
                setActiveIdx(0)
              } else {
                setActiveIdx(activeIdx + 1)
              }
              sectionRefs.current[activeIdx].scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'start',
              })
            }}
          >
            <Image src="/arrow-dark.svg" alt="arrow" width={15} height={15} />
            <Image src="/arrow-dark.svg" alt="arrow" width={15} height={15} />
            <Image src="/arrow-dark.svg" alt="arrow" width={15} height={15} />
            <Image src="/arrow-dark.svg" alt="arrow" width={15} height={15} />
            <Image src="/arrow-dark.svg" alt="arrow" width={15} height={15} />
          </button>
        )}
      </div>
      <DetailedMessageForm roomId={roomId} />
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
