import Image from 'next/image'
import Form from '../form/form'
import { useState } from 'react'
import { useQuery } from '../../convex/_generated/react'
import { redirectURL } from '../../utils'
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

  const animStr = (i: number) => {
    const delay = 1 // ms
    if (numInitialResponses === responses.length) {
      return `0s`
    }
    return `${delay * i}s`
  }

  return (
    <div className={styles.messageStream}>
      <div
        className={cx(styles.message, {
          [styles.addUrlStyle]: url?.length > 0,
        })}
        onClick={(): void => redirectURL(url)}
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
      </div>
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
            <div
              key={response._id.toString()}
              className={cx(styles.responseText, {
                [styles.addUrlStyle]: response.url?.length > 0,
                [styles.addAnimation]: numInitialResponses < responses.length,
              })}
              style={{ animationDelay: animStr(i) }}
              onClick={(): void => redirectURL(response.url)}
            >
              {response.body}
              {response.url?.length > 0 && (
                <Image
                  className={styles.urlArrow}
                  src="/arrow.svg"
                  alt="arrow"
                  width={15}
                  height={15}
                />
              )}
            </div>
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
