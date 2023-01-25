import Messages from '../components/messages/index'

export default function App() {
  return (
    <main>
      <p>
        the latest... <a href="/qq">QQ</a> and <a href="/emailme">emails</a>
      </p>
      <Messages roomId={null} />
      <p>
        laid off over zoom. designed the weekend after. find felicia on{' '}
        <a href="https://twitter.com/felchang">twitter</a>.
      </p>
      <p>
        learn more <a href="/about">about this site</a>.
      </p>
      <p>
        check out QQ aka <a href="/qq">quick questions</a>.
      </p>
    </main>
  )
}
