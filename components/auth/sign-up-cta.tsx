import { SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignUpCta(): JSX.Element {
  return (
    <SignUpButton>
      <button
        style={{
          backgroundColor: 'rgb(122, 160, 248)',
          padding: '15px 20px',
          marginTop: '10px',
          cursor: 'pointer',
        }}
      >
        <span style={{ paddingRight: '10px' }}>
          sign up for some SuPeR sEcReT club stuff
        </span>
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
    </SignUpButton>
  )
}
