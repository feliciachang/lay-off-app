import { useQuery } from "../convex/_generated/react"

export default function Home(): JSX.Element {
  console.log('home')

  const rooms = useQuery('listRooms') || []

  return <main>{rooms.map((room) => (
    <a key={room.name} href={room.name}>{room.name}</a>
  ))}</main>
}
