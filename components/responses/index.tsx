import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '../../convex/_generated/react'
import { formatURL } from '../../utils'
import { SubresponseForm } from './subresponse'
import useReadMore from '../messages/use-read-more'
import styles from './message-stream.module.css'
import cx from 'classnames'
import { useRouter } from 'next/router'

interface ResponseBodyProps {
  body: string
  url: string
  numInitialResponses: number
  responsesLength: number
  idx?: number
  id?: string
}

export function ResponseBody(props: ResponseBodyProps) {
  const { body, url, numInitialResponses, responsesLength, idx, id } = props

  const subresponses = useQuery('listSubresponses', id) || []

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

  const { clippedText, showReadMore, toggleTextLen, setToggleTextLen } =
    useReadMore(250, body)
  const [isHovering, setIsHovering] = useState(false)

  let message = (
    <span className={styles.responseText}>
      {clippedText}
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
        {clippedText}
        {toggleTextLen ? '...' : ''}
      </a>
    )
  }

  const router = useRouter()
  const { roomid } = router.query

  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return null
  }

  const roomInfo = useQuery('listRoom', getPageId(roomid))
  let roomName = roomInfo?.[0]?.name

  let subresponsesElement: JSX.Element | undefined
  if (roomName === 'transitions') {
    subresponsesElement = (
      <div>
        {subresponses?.map((subresponse) => {
          return (
            <div
              style={{
                fontSize: '18px',
                display: 'flex',
                color: '#D0D0D0',
              }}
            >
              <Image
                src="/dropdown-arrow.svg"
                alt="arrow"
                width={15}
                height={15}
              />
              <span style={{ paddingLeft: '3px' }}>{subresponse.body}</span>
            </div>
          )
        })}
        {isHovering && id && <SubresponseForm id={id} />}
      </div>
    )
  }
  return (
    <div
      className={cx(styles.responseAndSubresponses, {
        [styles.hasSubresponses]: roomName === 'transitions',
      })}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
      {subresponsesElement}
    </div>
  )
}
