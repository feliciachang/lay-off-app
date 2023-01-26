import { FormEvent, useState, useEffect } from 'react'
import { useMutation } from '../../convex/_generated/react'
import Image from 'next/image'
import styles from './Form.module.css'
import cx from 'classnames'
import { useForm, SubmitHandler } from 'react-hook-form'

interface FormProps {
  roomId?: string
}

interface IFormInput {
  messageText: string
  messageUrl: string
}

export default function QuickQuestionForm(props: FormProps) {
  const { roomId } = props
  const sendQuickQuestion = useMutation('sendQuickQuestion')
  const { register, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    await sendQuickQuestion(data.messageText, data.messageUrl, roomId ?? null)
  }
  const [openForm, setOpenForm] = useState(false)
  useEffect(() => {
    if (window.innerWidth > 600 || autoOpen) {
      setOpenForm(true)
    }
  })

  return (
    <>
      {openForm ? (
        <form className={styles.messageForm} onSubmit={handleSubmit(onSubmit)}>
          <input
            className={styles.formInput}
            {...register('messageText')}
            placeholder="be a friend, add a reply"
          />
          <input
            className={cx(styles.formInput, styles.addMargin)}
            {...register('messageUrl')}
            placeholder="and a url, if necessary"
          />
          <button className={styles.submitButton} type="submit">
            <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
          </button>
          {/* {!isValidUrl && (
            <div className={styles.invalidUrl}>invalid url, try again</div>
          )} */}
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
