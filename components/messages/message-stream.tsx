import Image from 'next/image'
import Form from '../form/form'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '../../convex/_generated/react'
import { formatURL } from '../../utils'
import styles from './message-stream.module.css'
import useResponseForm from '../form/use-response-form'
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

  const responses = useQuery('listResponses', id) || []

  const {
    newResponseText,
    setNewResponseText,
    newResponseUrl,
    setNewResponseUrl,
    handleSendResponse,
    isValidUrl,
  } = useResponseForm(id)

  const [numInitialResponses, setNumInitialResponses] = useState(5)

  return (
    <div className={styles.messageStreamContainer}>
      {addDate && <p>{creationTime}</p>}
      <div className={styles.messageStream}>
        <MessageBody body={body} url={url} />
        <div className={styles.rightMessage}>
          <Form
            handleSendMessage={handleSendResponse}
            newResponseText={newResponseText}
            setNewResponseText={setNewResponseText}
            newResponseUrl={newResponseUrl}
            setNewResponseUrl={setNewResponseUrl}
            isValidUrl={isValidUrl}
          />
          <div>
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

interface ResponseBodyProps {
  body: string
  url: string
  numInitialResponses: number
  responsesLength: number
  idx?: number
}

export function ResponseBody(props: ResponseBodyProps) {
  const { body, url, numInitialResponses, responsesLength, idx } = props

  const animStr = (i: number | undefined) => {
    if (!i) {
      return `0s`
    }
    const delay = 1 // ms
    if (numInitialResponses === responsesLength) {
      return `0s`
    }
    return `${delay * i}s`
  }

  if (url.length > 0) {
    return (
      <a
        target="_blank"
        className={cx(styles.responseText, {
          [styles.addUrlStyle]: url?.length > 0,
          [styles.addAnimation]: numInitialResponses < responsesLength,
        })}
        style={{ animationDelay: animStr(idx) }}
        href={formatURL(url)}
      >
        {body}
        {url?.length > 0 && (
          <Image
            className={styles.urlArrow}
            src="/arrow.svg"
            alt="arrow"
            width={15}
            height={15}
          />
        )}
      </a>
    )
  }
  return (
    <div
      className={cx(styles.responseText, {
        [styles.addAnimation]: numInitialResponses < responsesLength,
      })}
      style={{ animationDelay: animStr(idx) }}
    >
      {body}
    </div>
  )
}

interface MessageBodyProps {
  body: string
  url: string
}
export function MessageBody(props: MessageBodyProps) {
  const { body, url } = props

  const maxTextLenRef = useRef(200)
  const [toggleTextLen, setToggleTextLen] = useState(true)
  const [showReadMore, setShowReadMore] = useState(false)

  useEffect(() => {
    if (body.length <= maxTextLenRef.current) return
    setShowReadMore(true)
    setToggleTextLen(true)
    let tempBody = body.slice(0, maxTextLenRef.current)
    while (tempBody[tempBody.length - 1] !== ' ') {
      tempBody = tempBody.slice(0, tempBody.length - 1)
    }
    maxTextLenRef.current = tempBody.length - 1
  }, [body, maxTextLenRef])

  let bodyText = toggleTextLen ? body.slice(0, maxTextLenRef.current) : body
  let message = (
    <div>
      {bodyText}
      {toggleTextLen ? '...' : ''}
    </div>
  )
  if (url?.length > 0) {
    message = (
      <a
        target="_blank"
        href={formatURL(url)}
        className={cx(styles.message, styles.addUrlStyle)}
      >
        {bodyText}
        {toggleTextLen ? '...' : ''}
        <Image
          className={styles.urlArrow}
          src="/arrow.svg"
          alt="arrow"
          width={15}
          height={15}
        />
      </a>
    )
  }

  return (
    <div className={styles.message}>
      {message}
      {showReadMore && (
        <a
          className={styles.readMore}
          onClick={(): void => setToggleTextLen(!toggleTextLen)}
        >
          {toggleTextLen ? 'read more' : 'read less'}
        </a>
      )}
    </div>
  )
}
