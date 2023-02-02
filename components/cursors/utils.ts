export interface ICursorPosition {
  id?: string
  x: number
  y: number
  type: ICursorType
}

export enum ICursorType {
  Happy = 'happy',
  Sad = 'sad',
}

export const convertStringToICursorType = (
  maybeCursorType: string
): ICursorType => {
  // convert to known type
  const cursorType = Object.values(ICursorType).find(
    (f) => f === maybeCursorType
  )
  if (cursorType) {
    return cursorType
  } else {
    return ICursorType.Happy
  }
}
