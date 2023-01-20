import Messages from '../components/messages/index'
import QuickQuestion from '../components/quick-questions'
import { useRouter } from 'next/router'
import { useQuery } from '../convex/_generated/react'

export default function Room() {
  const router = useRouter()
  const { roomid } = router.query
  console.log(roomid)
  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return null
  }

  const roomInfo = useQuery('listRoom', getPageId(roomid))
  console.log(roomInfo)
  let roomId = roomInfo?.[0]._id?.id.toString()
  let roomName = roomInfo?.[0].name
  if (!roomId) {
    return <></>
  }

  let messages: JSX.Element
  if (roomName === 'qq') {
    messages = <QuickQuestion roomId={roomId} />
  } else {
    messages = (
      <Messages
        roomId={roomId}
        messageLabel="Add to this about page. It's a party."
      />
    )
  }

  return <main>{messages}</main>
}
