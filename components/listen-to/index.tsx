import styles from '../messages/message-stream.module.css'
import { useQuery } from '../../convex/_generated/react'

interface ListenToProps {
  roomId?: string
}

export default function ListenTo(props: ListenToProps) {
  const responses = useQuery('listResponses', 'MmLYoNpp84JcY8ApHaJLww') || []
  return (
    <div className={styles.messageStreamContainer}>
      <div>when i listen to</div>
      <div>
        {responses.map((response) => (
          <div>{response.body}</div>
        ))}
      </div>
    </div>
  )
}
