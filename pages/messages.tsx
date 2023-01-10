import { FormEvent, useState, useEffect } from 'react'
import Image from 'next/image'
import Form from '../components/form'
import { useMutation, useQuery } from '../convex/_generated/react'
import styles from '../styles/Home.module.css'
import cx from 'classnames'

export default function MessageContainer() {
  const messages = useQuery('listMessages') || []

  const [newMessageText, setNewMessageText] = useState('')
  const [newMessageUrl, setNewMessageUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const sendMessage = useMutation('sendMessage')

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    if (newMessageUrl.length > 0 && !validURL(newMessageUrl)) {
      setIsValidUrl(false)
      return
    }
    setNewMessageText('')
    setNewMessageUrl('')
    await sendMessage(newMessageText, '', newMessageUrl)
  }

  return (
    <div>
      {messages.map((message) => (
        <MessageStream
          id={message._id.toString()}
          url={message.url}
          body={message.body}
          creationTime={new Date(message._creationTime).toLocaleTimeString()}
        />
      ))}
      {messages.length > 0 && (
        <div className={styles.invitationFormContainer}>
          <div className={styles.invitationText}>
            Laid off too? Add a message, or just ur feelings. It's a party.
          </div>
          <Form
            handleSendMessage={handleSendMessage}
            newResponseText={newMessageText}
            setNewResponseText={setNewMessageText}
            newResponseUrl={newMessageUrl}
            setNewResponseUrl={setNewMessageUrl}
            isValidUrl={isValidUrl}
          />
        </div>
      )}
    </div>
  )
}

interface MessageStreamProps {
  id: string
  body: string
  url: string
  creationTime: string
}
function MessageStream(props: MessageStreamProps) {
  const { id, body, url, creationTime } = props

  const responses = useQuery('listResponses', id) || []

  const [newResponseText, setNewResponseText] = useState('')
  const [newResponseUrl, setNewResponseUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const sendResponse = useMutation('sendResponse')

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    if (newResponseUrl.length > 0 && !validURL(newResponseUrl)) {
      setIsValidUrl(false)
      return
    }
    setNewResponseText('')
    setNewResponseUrl('')
    await sendResponse(id, newResponseText, '', newResponseUrl)
  }

  const delay = 1 // ms
  const animStr = (i: number) => `${delay * i}s`

  return (
    <div className={styles.messageStream}>
      <div
        className={cx(styles.message, {
          [styles.addUrlStyle]: url?.length > 0,
        })}
        onClick={(): void => {
          if (url?.length > 0) {
            if (url.slice(0, 8) !== 'https://') {
              window.open('https://' + url, '_blank')
            }
            window.open(url, '_blank')
          }
        }}
      >
        {body}
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
      <div className={styles.rightMessage}>
        <Form
          handleSendMessage={handleSendMessage}
          newResponseText={newResponseText}
          setNewResponseText={setNewResponseText}
          newResponseUrl={newResponseUrl}
          setNewResponseUrl={setNewResponseUrl}
          isValidUrl={isValidUrl}
        />
        <div>
          {responses.map((response, i) => (
            <div
              key={response._id.toString()}
              className={cx(styles.responseText, {
                [styles.addUrlStyle]: response.url?.length > 0,
              })}
              style={{ animationDelay: animStr(i) }}
              onClick={(): void => {
                if (response.url?.length > 0) {
                  if (url.slice(0, 8) !== 'https://') {
                    window.open('https://' + url, '_blank')
                  }
                  window.open(url, '_blank')
                }
              }}
            >
              {response.body}
              {response.url?.length > 0 && (
                <Image
                  className={styles.urlArrow}
                  src="/arrow.svg"
                  alt="arrow"
                  width={15}
                  height={15}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
