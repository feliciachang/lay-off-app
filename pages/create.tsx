import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import SignInCta from '../components/auth/sign-in-cta'
import { useMutation } from '../convex/_generated/react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Create() {
  const { isSignedIn, user } = useUser()
  const createRoom = useMutation('createRoom')
  const { push } = useRouter()

  const { register, handleSubmit } = useForm()

  if (!isSignedIn) {
    return <SignInCta />
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        //TODO: make sure name is unique
        await createRoom(data.newRoomName, [], user.id)
        push(data.newRoomName)
      })}
    >
      <input
        placeholder="give your page a name"
        required
        {...register('newRoomName', { required: true })}
      />
      <button type="submit">
        <Image src="/arrow.svg" alt="arrow" width={15} height={15} />
      </button>
    </form>
  )
}
