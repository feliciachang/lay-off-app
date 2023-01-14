import Messages from '../../components/messages/index'
import { useRouter } from 'next/router'

export default function Room() {
  const router = useRouter()
  const { roomid } = router.query

  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return undefined
  }
  return (
    <main>
      <Messages
        roomId={getPageId(roomid)}
        messageLabel="Add to this about page. It's a party."
      />
      <p>
        laid off over zoom. designed the weekend after. find felicia on{' '}
        <a href="https://twitter.com/felchang">twitter</a>.
      </p>
    </main>
  )
}
