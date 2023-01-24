import { FormEvent, useState } from 'react'
import Image from 'next/image'
import styles from './Form.module.css'
import cx from 'classnames'

interface GenericFormProps {
  handleSubmit: (event: FormEvent) => Promise<void>
  emailText: string
  setEmailText: (value: string) => void
  submitMessage?: string
}

export default function GenericForm(props: GenericFormProps): JSX.Element {
  const { handleSubmit, emailText, setEmailText, submitMessage } = props

  return (
    <form
      className={cx(styles.messageForm, styles.emailForm)}
      onSubmit={handleSubmit}
    >
      <input
        className={styles.formInput}
        value={emailText}
        onChange={(event) => setEmailText(event.target.value)}
        placeholder="email@email.com"
      />
      <button
        className={styles.submitButton}
        type="submit"
        disabled={!emailText}
      >
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
      {submitMessage && <p className={styles.invalidUrl}>{submitMessage}</p>}
    </form>
  )
}
