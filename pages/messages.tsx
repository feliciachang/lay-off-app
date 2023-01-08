import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useMutation, useQuery } from '../convex/_generated/react'
import styles from '../styles/Home.module.css'
import cx from 'classnames'

export default function MessageContainer() {
  const messages = useQuery('listMessages') || []

  const [newMessageText, setNewMessageText] = useState('')
  const [newMessageUrl, setNewMessageUrl] = useState('')
  const sendMessage = useMutation('sendMessage')

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
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
      <div>
        <div className={styles.invitationText}>
          Laid off too? Add a request, or just ur feelings. It's a party.
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="let's commisserate"
          />
          <input
            className={styles.addMargin}
            value={newMessageUrl}
            onChange={(event) => setNewMessageUrl(event.target.value)}
            placeholder="add a url"
          />
          <input type="submit" value="Send" disabled={!newMessageText} />
        </form>
      </div>
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
  const sendResponse = useMutation('sendResponse')

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    setNewResponseText('')
    setNewResponseUrl('')
    await sendResponse(id, newResponseText, '', newResponseUrl)
  }

  return (
    <div className={styles.messageStream}>
      <div className={styles.message}>
        <span>{body}</span>
      </div>
      <div className={styles.rightMessage}>
        <form onSubmit={handleSendMessage}>
          <input
            value={newResponseText}
            onChange={(event) => setNewResponseText(event.target.value)}
            placeholder="b a friend, add a message"
          />
          <input
            className={styles.addMargin}
            value={newResponseUrl}
            onChange={(event) => setNewResponseUrl(event.target.value)}
            placeholder="and a url, if necessary"
          />
          <input
            type="submit"
            value="join the club"
            disabled={!newResponseText}
          />
        </form>
        <div>
          {responses.map((response) => (
            <div
              className={cx(styles.responseText, {
                [styles.addUrlStyle]: response.url?.length > 0,
              })}
              onClick={(): void => {
                if (response.url?.length > 0) {
                  window.location.href = response.url
                }
              }}
            >
              <span>{response.body}</span>
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
