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
      <Messages roomId={getPageId(roomid)} />
      <p>
        laid off over zoom. designed the weekend after. find felicia on{' '}
        <a href="https://twitter.com/felchang">twitter</a>. lets talk irl!
      </p>
      <p>
        or join the
        <a href="https://discord.gg/mUyBDV325e">laid off club discord </a> i
        just made lol. also wana make my own chat room for the fun of it. stay
        tuned.
      </p>
    </main>
  )
}
