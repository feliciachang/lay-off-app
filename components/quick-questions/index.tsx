import TodaysQuickQuestion from './todays-message'
import { useState } from 'react'
import styles from './index.module.css'
interface QuickQuestionProps {
  roomId?: string
}

export default function QuickQuestion(props: QuickQuestionProps) {
  const { roomId } = props

  const [showPastQuestions, setShowPastQuestions] = useState(false)

  let links = (
    <div>
      <p>
        <a
          onClick={() => {
            setShowPastQuestions(true)
          }}
        >
          what are these?
        </a>
      </p>
      <p>
        <a href="/">take me home</a>
      </p>
    </div>
  )

  return (
    <div>
      <div className={styles.quickquestion}>
        {showPastQuestions ? (
          <p>quick questions from the past...</p>
        ) : (
          <p>here's a quick question...</p>
        )}
        {links}
      </div>
      <TodaysQuickQuestion roomId={roomId} />
    </div>
  )
}
