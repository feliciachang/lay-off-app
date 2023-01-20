import { FormEvent, useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Form.module.css'
import cx from 'classnames'

interface FormProps {
  handleSendMessage: (event: FormEvent) => Promise<void>
  newResponseText: string
  setNewResponseText: (value: string) => void
  newResponseUrl: string
  setNewResponseUrl: (value: string) => void
  isValidUrl: boolean
  textPlaceholder?: string
  autoOpen?: boolean
}

export default function Form(props: FormProps) {
  const {
    handleSendMessage,
    setNewResponseText,
    setNewResponseUrl,
    newResponseText,
    newResponseUrl,
    isValidUrl,
    textPlaceholder,
    autoOpen,
  } = props

  const [openForm, setOpenForm] = useState(false)
  useEffect(() => {
    if (window.innerWidth > 600 || autoOpen) {
      setOpenForm(true)
    }
  })

  return (
    <>
      {openForm ? (
        <form className={styles.messageForm} onSubmit={handleSendMessage}>
          <input
            className={styles.formInput}
            value={newResponseText}
            onChange={(event) => setNewResponseText(event.target.value)}
            placeholder={textPlaceholder ?? 'be a friend, add a reply'}
          />
          <input
            className={cx(styles.formInput, styles.addMargin)}
            value={newResponseUrl}
            onChange={(event) => setNewResponseUrl(event.target.value)}
            placeholder="and a url, if necessary"
          />
          <button
            className={styles.submitButton}
            type="submit"
            disabled={!newResponseText}
          >
            <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
          </button>
          {!isValidUrl && (
            <div className={styles.invalidUrl}>invalid url, try again</div>
          )}
        </form>
      ) : (
        <div
          className={styles.formNotice}
          onClick={(): void => {
            setOpenForm(true)
          }}
        >
          add a reply
        </div>
      )}
    </>
  )
}
