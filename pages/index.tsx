import Messages from '../components/messages/index'
import SignUpCta from '../components/auth/sign-up-cta'

export default function App() {
  return (
    <main>
      <Messages roomId={null} />
      <p>
        laid off over zoom. designed the weekend after. find felicia on{' '}
        <a href="https://twitter.com/felchang">twitter</a>.
      </p>
      <p>
        learn more <a href="/about">about this site</a>.
      </p>
      <p>
        <a href="/transitions">a part two</a> after being unemployed for two
        months.
      </p>
      <SignUpCta />
    </main>
  )
}
