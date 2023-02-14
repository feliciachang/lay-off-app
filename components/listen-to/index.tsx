import styles from '../messages/message-stream.module.css'
import Image from 'next/image'
import formStyles from '../emails/form.module.css'
import { useMutation, useQuery } from '../../convex/_generated/react'
import { useForm } from 'react-hook-form'
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube'
import { useState, useEffect } from 'react'
import cx from 'classnames'

interface ListenToProps {
  roomId?: string
}

export default function ListenTo(props: ListenToProps) {
  const { roomId } = props

  let videoElement: YouTubePlayer = null

  const _onReady = (event: YouTubePlayer) => {
    videoElement = event
  }

  const responses = useQuery('listResponses', 'MmLYoNpp84JcY8ApHaJLww') || []
  const sendResponse = useMutation('sendResponse')
  const { register, handleSubmit, reset } = useForm()

  const [playVideo, setPlayVideo] = useState(false)

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: playVideo ? 1 : 0,
    },
  }

  useEffect(() => {
    if (!playVideo) {
      videoElement.target.playVideo()
    }
  }, [playVideo])

  return (
    <div className={cx(styles.messageStreamContainer, styles.messageStream)}>
      <div className={styles.message}>when i listen to</div>
      <div className={styles.rightMessage}>
        <form
          className={formStyles.messageForm}
          onSubmit={handleSubmit(async (data) => {
            sendResponse(
              'MmLYoNpp84JcY8ApHaJLww',
              data.newResponseText,
              '',
              data.newResponseUrl
            )
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
        {responses.map((response) => (
          <div key={response._id.toString()}>
            <div onClick={() => setPlayVideo(true)}>{response.body}</div>
            <YouTube videoId="2Q_ZzBGPdqE" opts={opts} onReady={_onReady} />
          </div>
        ))}
      </div>
    </div>
  )
}
