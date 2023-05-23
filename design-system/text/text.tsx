import { formatURL } from '../../utils'
import useReadMore from '../../components/messages/use-read-more'
import styles from './text.module.css'
import cx from 'classnames'

interface TextProps {
  type: 'message' | 'response' | 'subresponse' | 'darkMode'
  url?: string
  maxChar?: number
  text: string
}

export default function Text(props: TextProps): JSX.Element {
  const { text, type, url, maxChar } = props

  const MAX_CHAR = maxChar ?? 250

  const { clippedText, showReadMore, toggleTextLen, setToggleTextLen } =
    useReadMore(MAX_CHAR, text)

  let message = (
    <span
      className={cx({
        [styles.url]: url,
      })}
    >
      {clippedText}
      {toggleTextLen ? '...' : ''}
    </span>
  )

  return (
    <span
      className={cx(styles.text, {
        [styles.message]: type === 'message',
        [styles.response]: type === 'response',
        [styles.subresponse]: type === 'subresponse',
        [styles.darkMode]: type === 'darkMode',
      })}
    >
      {url ? (
        <a
          className={cx(styles.url, {
            [styles.white]: type === 'message',
            [styles.grayed]: type === 'response' || type === 'subresponse',
          })}
          target="_blank"
          href={formatURL(url)}
        >
          {message}
        </a>
      ) : (
        message
      )}
      {showReadMore && (
        <span
          className={cx(styles.readMore, {
            [styles.message]: type === 'message',
            [styles.response]: type === 'response',
            [styles.subresponse]: type === 'subresponse',
          })}
          onClick={(): void => setToggleTextLen(!toggleTextLen)}
        >
          {toggleTextLen ? ' read more' : ' read less'}
        </span>
      )}
    </span>
  )
}
