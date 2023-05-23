import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '../../convex/_generated/react'
import { useMutation } from '../../convex/_generated/react'
import SubresponseBody from './subresponse'
import styles from './index.module.css'
import formStyles from '../emails/form.module.css'
import Text from '../../design-system/text/text'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import cx from 'classnames'
import { useRouter } from 'next/router'

interface ResponseBodyProps {
  body: string
  url: string
  numInitialResponses: number
  responsesLength: number
  idx?: number
  id?: string
  allowSubresponses?: boolean
}

export default function ResponseBody(props: ResponseBodyProps) {
  const {
    body,
    url,
    numInitialResponses,
    responsesLength,
    idx,
    id,
    allowSubresponses,
  } = props

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

  const [isHovering, setIsHovering] = useState(false)

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

  const sendSubresponse = useMutation('sendSubresponse')

  const { user } = useUser()

  const { register, handleSubmit, reset } = useForm()

  if (!allowSubresponses) {
    return (
      <div
        className={styles.responseAndSubresponses}
        style={{ animationDelay: animStr(idx) }}
      >
        <div className={styles.responseContainer}>
          <Text type="darkMode" text={body} maxChar={250} url={url} />
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
      </div>
    )
  }
  const subresponsesElement = (
    <div>
      {subresponses?.map((subresponse) => {
        return <SubresponseBody body={subresponse.body} url={subresponse.url} />
      })}
      {isHovering && id && (
        <form
          className={formStyles.messageForm}
          onSubmit={handleSubmit(async (data) => {
            await sendSubresponse(
              id,
              data.newSubresponseText,
              '',
              data.newSubresponseUrl,
              user?.id ?? null
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
      )}
    </div>
  )

  return (
    <div
      className={cx(styles.responseAndSubresponses, {
        [styles.hasSubresponses]:
          roomName === 'transitions' || roomName === 'workingonavisa',
      })}
      style={{ animationDelay: animStr(idx) }}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.responseContainer}>
        <Text type="response" text={body} maxChar={250} url={url} />
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
