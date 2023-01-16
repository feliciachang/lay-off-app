import Image from 'next/image'
import Form from '../form/form'
import { useState } from 'react'
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
}

export default function MessageStream(props: MessageStreamProps) {
  const { id, body, url } = props

  const responses = useQuery('listResponses', id) || []

  const {
    newResponseText,
    setNewResponseText,
    newResponseUrl,
    setNewResponseUrl,
    handleSendResponse,
    isValidUrl,
  } = useResponseForm(id)

  const [numInitialResponses, setNumInitialResponses] = useState(20)

  return (
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
  )
}

interface ResponseBodyProps {
  body: string
  url: string
  numInitialResponses: number
  responsesLength: number
  idx: number
}

function ResponseBody(props: ResponseBodyProps) {
  const { body, url, numInitialResponses, responsesLength, idx } = props

  const animStr = (i: number) => {
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

  if (url?.length > 0) {
    return (
      <a
        target="_blank"
        href={formatURL(url)}
        className={cx(styles.message, styles.addUrlStyle)}
      >
        {body}
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

  return <div className={styles.message}>{body}</div>
}
