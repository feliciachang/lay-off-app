import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/clerk-react'
import formStyles from '../emails/form.module.css'
import { useMutation } from '../../convex/_generated/react'
import cx from 'classnames'

interface SubreponseFormProps {
  id: string
}

export function SubresponseForm(props: SubreponseFormProps) {
  const { id } = props
  const sendSubresponse = useMutation('sendSubresponse')

  const { user } = useUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  return (
    <form
      className={formStyles.messageForm}
      onSubmit={handleSubmit(async (data) => {
        await sendSubresponse(
          id,
          data.newSubresponseText,
          user?.id || '',
          data.newSubresponseUrl
        )
        reset()
      })}
    >
      <input
        className={formStyles.formInput}
        placeholder="start a mini convo"
        {...register('newSubresponseText', { required: true })}
      />
      <input
        className={cx(formStyles.formInput, formStyles.addMargin)}
        placeholder="and a url, if necessary"
        {...register('newSubresponseUrl', {
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
  )
}
