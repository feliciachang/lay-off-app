import TodaysQuickQuestion from './todays-message'
import { useState } from 'react'
import styles from './index.module.css'
interface QuickQuestionProps {
  roomId?: string
}

export default function QuickQuestion(props: QuickQuestionProps) {
  const { roomId } = props

  const [displayAllResponses, setDisplayAllResponses] = useState(false)

  let links = (
    <div>
      {!displayAllResponses ? (
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
      ) : (
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
      )}
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
      />
    </div>
  )
}
