import { CursorOne } from './emojis/cursor-one'
import { CursorTwo } from './emojis/cursor-two'
import { CursorThree } from './emojis/cursor-three'
import { CursorFour } from './emojis/cursor-four'
import { CursorFive } from './emojis/cursor-five'

export interface ICursorPosition {
  id?: string
  x: number
  y: number
  type: string
}

export const cursorTypeToComponent = (cursorType: string): JSX.Element => {
  switch (cursorType) {
    case '1':
      return <CursorOne />
    case '2':
      return <CursorTwo />
    case '3':
      return <CursorThree />
    case '4':
      return <CursorFour />
    case '5':
      return <CursorFive />
    default:
      return <CursorFive />
  }
}
