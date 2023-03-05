import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import { formatURL } from '../../utils'
import { useUser } from '@clerk/clerk-react'
import ResponseBody from '../responses'
import useReadMore from './use-read-more'
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

  const responses = useQuery('listResponses', id) || []
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
        <MessageBody body={body} url={url} />
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

interface MessageBodyProps {
  body: string
  url: string
}

// https://github.com/LogSnag/logsnag.js
// import { LogSnag } from 'logsnag';

export function MessageBody(props: MessageBodyProps) {
  const { body, url } = props

  const { clippedText, showReadMore, toggleTextLen, setToggleTextLen } =
    useReadMore(250, body)

  let message = (
    <span>
      {clippedText}
      {toggleTextLen ? '...' : ''}
    </span>
  )
  if (url?.length > 0) {
    message = (
      <a
        target="_blank"
        href={formatURL(url)}
        className={cx(styles.message, styles.addUrlStyle)}
      >
        {clippedText}
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
          {toggleTextLen ? ' read more' : ' read less'}
        </a>
      )}
    </div>
  )
}
