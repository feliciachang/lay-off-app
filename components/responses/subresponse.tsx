import Image from 'next/image'
import { formatURL } from '../../utils'
import useReadMore from '../messages/use-read-more'
import styles from './index.module.css'
import cx from 'classnames'

interface SubresponseBodyProps {
  body: string
  url: string
}

export default function SubresponseBody(
  props: SubresponseBodyProps
): JSX.Element {
  const { body, url } = props

  const { clippedText, showReadMore, toggleTextLen, setToggleTextLen } =
    useReadMore(250, body)

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

  return (
    <div
      style={{
        fontSize: '18px',
        display: 'flex',
        color: '#D0D0D0',
      }}
    >
      <Image src="/dropdown-arrow.svg" alt="arrow" width={15} height={15} />
      <span>
        <span style={{ paddingLeft: '3px' }}>{message}</span>
        {showReadMore && (
          <a
            className={cx(styles.readMore, styles.small)}
            onClick={(): void => setToggleTextLen(!toggleTextLen)}
          >
            {toggleTextLen ? ' read more' : ' read less'}
          </a>
        )}
      </span>
    </div>
  )
}
