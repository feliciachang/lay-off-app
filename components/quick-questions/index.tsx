import TodaysQuickQuestion from './todays-message'
import { useState } from 'react'
import styles from './index.module.css'
interface QuickQuestionProps {
  roomId?: string
}

export default function QuickQuestion(props: QuickQuestionProps) {
  const { roomId } = props

  const [displayAllResponses, setDisplayAllResponses] = useState(false)
  const [userHasResponded, setUserHasResponded] = useState(false)

  let linkToggle: JSX.Element | undefined
  if (!displayAllResponses) {
    linkToggle = (
      <a
        onClick={() => {
          setDisplayAllResponses(true)
        }}
        className={styles.about}
      >
        what is this?
      </a>
    )
  } else if (displayAllResponses && !userHasResponded) {
    linkToggle = (
      <a
        onClick={() => {
          setDisplayAllResponses(false)
        }}
        className={styles.about}
      >
        respond to today's question
      </a>
    )
  }

  let links = (
    <div className={styles.extraLinks}>
      {linkToggle}
      {` · `}
      <span>
        <a href="/emailme">get emails!</a>
      </span>
      {` · `}
      <span>
        <a href="/">take me home</a>
      </span>
    </div>
  )

  return (
    <div className={styles.spaceBetween}>
      <div>
        <div className={styles.quickquestion}>
          {displayAllResponses ? (
            <div>
              <p>quick questions from the past...</p>
              <p>new questions daily</p>
            </div>
          ) : (
            <p>here's a quick question...</p>
          )}
        </div>
        <TodaysQuickQuestion
          roomId={roomId}
          displayAllResponses={displayAllResponses}
          setDisplayAllResponses={setDisplayAllResponses}
          userHasResponded={userHasResponded}
          setUserHasResponded={setUserHasResponded}
        />
      </div>
      <div>{links}</div>
    </div>
  )
}
