import { useRef, useState, useEffect } from 'react'
interface UseReadMoreValues {
  clippedText: string
  showReadMore: boolean
  toggleTextLen: boolean
  setToggleTextLen: (toggleTextLen: boolean) => void
}

export default function useReadMore(
  maxTextLen: number,
  fullText: string
): UseReadMoreValues {
  const maxTextLenRef = useRef(maxTextLen)
  const [toggleTextLen, setToggleTextLen] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)

  useEffect(() => {
    if (fullText.length <= maxTextLenRef.current) return
    setShowReadMore(true)
    setToggleTextLen(true)
    let tempBody = fullText.slice(0, maxTextLenRef.current)
    while (tempBody[tempBody.length - 1] !== ' ') {
      tempBody = tempBody.slice(0, tempBody.length - 1)
    }
    maxTextLenRef.current = tempBody.length - 1
  }, [fullText, maxTextLenRef])

  let clippedText = toggleTextLen
    ? fullText.slice(0, maxTextLenRef.current)
    : fullText

  return {
    clippedText,
    toggleTextLen,
    showReadMore,
    setToggleTextLen,
  }
}
