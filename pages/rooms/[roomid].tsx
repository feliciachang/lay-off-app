import Messages from '../../components/messages/index'
import { useRouter } from 'next/router'
import { useQuery } from '../../convex/_generated/react'

export default function Room() {
  const router = useRouter()
  const { roomid } = router.query

  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return undefined
  }

  const roomInfo = useQuery('listRoom', getPageId(roomid))
  return (
    <main>
      {roomInfo && roomInfo?.name === 'desire' && <div>prompt style</div>}
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
