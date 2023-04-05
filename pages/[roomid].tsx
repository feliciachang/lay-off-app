import Messages from '../components/messages/index'
import { useRouter } from 'next/router'
import { useQuery } from '../convex/_generated/react'
import SignUpCta from '../components/auth/sign-up-cta'
import Twice from '../components/messages-v2/twice'

export default function Room() {
  const router = useRouter()
  const { roomid } = router.query

  function getPageId(roomid: string | string[] | undefined) {
    if (typeof roomid === 'string') {
      return roomid
    }
    return null
  }

  const roomInfo = useQuery('listRoom', getPageId(roomid))
  let roomId = roomInfo?.[0]?._id?.id?.toString()
  let roomName = roomInfo?.[0]?.name
  if (!roomId) {
    return <></>
  }

  if (roomName === 'twice') {
    return (
      <main>
        <Twice roomId={roomId} />
      </main>
    )
  }

  return (
    <main>
      <Messages
        roomId={roomId}
        messageLabel="Add to this page. It's a party."
      />
      {roomName === 'transitions' && (
        <p style={{ maxWidth: '500px', marginBottom: '100px' }}>
          {`I want to acknowledge how this conversation is filtered through my specific experience. I’d like to feature different experiences that
            cover the broad and diverse stories about work in this era we
            live in. If you have a story or convo you want to start, `}
          <a href="https://form.typeform.com/to/DNstydCa">
            {' '}
            please reach out here!
          </a>
        </p>
      )}
      <SignUpCta />
    </main>
  )
}
