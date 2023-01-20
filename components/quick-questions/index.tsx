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
      <p>
        <a
          onClick={() => {
            setDisplayAllResponses(true)
          }}
          className={styles.about}
        >
          what is this?
        </a>
      </p>
    )
  } else if (displayAllResponses && !userHasResponded) {
    linkToggle = (
      <p>
        <a
          onClick={() => {
            setDisplayAllResponses(false)
          }}
          className={styles.about}
        >
          respond to today's question
        </a>
      </p>
    )
  }

  let links = (
    <div>
      {linkToggle}
      <p>
        <a href="/">take me home</a>
      </p>
    </div>
  )

  return (
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
        {links}
      </div>
      <TodaysQuickQuestion
        roomId={roomId}
        displayAllResponses={displayAllResponses}
        setDisplayAllResponses={setDisplayAllResponses}
        userHasResponded={userHasResponded}
        setUserHasResponded={setUserHasResponded}
      />
    </div>
  )
}
