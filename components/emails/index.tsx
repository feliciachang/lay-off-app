import { useMutation } from '../../convex/_generated/react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import styles from './form.module.css'
import cx from 'classnames'

export default function EmailForm(): JSX.Element {
  const sendEmail = useMutation('sendEmail')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  return (
    <form
      className={cx(styles.messageForm, styles.emailForm)}
      onSubmit={handleSubmit(async (data) => {
        await sendEmail(data.emailText)
        reset()
      })}
    >
      <input
        className={styles.formInput}
        placeholder="email@email.com"
        {...register('emailText', {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'invalid email address',
          },
        })}
      />
      <button className={styles.submitButton} type="submit">
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
      {isSubmitSuccessful && (
        <p className={styles.invalidUrl}>Get ready for emails your way.</p>
      )}
      {errors.emailText && (
        <p className={styles.invalidUrl}>Bad Email! Please try again.</p>
      )}
    </form>
  )
}
