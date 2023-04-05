import { SignInButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInCta(): JSX.Element {
  return (
    <SignInButton>
      <button
        style={{
          backgroundColor: 'rgb(122, 160, 248)',
          padding: '15px 20px',
          marginTop: '10px',
          cursor: 'pointer',
        }}
      >
        <span style={{ paddingRight: '10px' }}>
          sign in before creating a page
        </span>
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
    </SignInButton>
  )
}
