import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '../../convex/_generated/react'
import { formatURL } from '../../utils'
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
  console.log(id)
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
              sendResponse(id, data.newResponseText, '', data.newResponseUrl)
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

  const maxTextLenRef = useRef(250)
  const [toggleTextLen, setToggleTextLen] = useState(false)
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
    <span className={styles.responseText}>
      {bodyText}
      {toggleTextLen ? '...' : ''}
    </span>
  )

  if (url.length > 0) {
    message = (
      <a
        target="_blank"
        className={cx(styles.responseText, {
          [styles.addUrlStyle]: url?.length > 0,
        })}
        href={formatURL(url)}
      >
        {bodyText}
        {toggleTextLen ? '...' : ''}
      </a>
    )
  }
  return (
    <div
      className={styles.responseContainer}
      style={{ animationDelay: animStr(idx) }}
    >
      <span>
        {message}
        {showReadMore && (
          <a
            className={styles.readMore}
            onClick={(): void => setToggleTextLen(!toggleTextLen)}
          >
            {toggleTextLen ? ' read more' : ' read less'}
          </a>
        )}
      </span>
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

  const maxTextLenRef = useRef(250)
  const [toggleTextLen, setToggleTextLen] = useState(false)
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
    <span>
      {bodyText}
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
          {toggleTextLen ? ' read more' : ' read less'}
        </a>
      )}
    </div>
  )
}
