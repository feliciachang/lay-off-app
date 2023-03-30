import { ReactMutation } from 'convex/react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useMouse } from 'react-use'
import { API } from '../../convex/_generated/api'
import { useMutation, useQuery } from '../../convex/_generated/react'
import style from './index.module.css'
import { cursorTypeToComponent, ICursorPosition } from './utils'

/**
 * CursorRender records user's cursor clicks
 * and also renders existing cursor positions in the database
 */
export const CursorRenderer = (props: React.PropsWithChildren<{}>) => {
  const { children } = props
  const { recordMyPosition, recordedPositions } = useCursorPositions()

  const containerRef = useRef(null)
  const { elX, elY } = useMouse(containerRef)

  const emojis = [
    '/emojis/1.svg',
    '/emojis/2.svg',
    '/emojis/3.svg',
    '/emojis/4.svg',
    '/emojis/5.svg',
  ]
  const indexRef = useRef(Math.floor(Math.random() * 5))
  const userEmoji = emojis[indexRef.current]
  const sigh = indexRef.current + 1

  const onClick = useCallback(() => {
    recordMyPosition(elX, elY, sigh.toString())
  }, [elX, elY])

  // todo: this should not be click, otherwise a new cursor will appear whenever
  // any click is done. this should happen only when click + some other
  // condition (like a key is being pressed or a button is selected, similar to Figjam)
  useEffect(() => {
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [onClick])

  return (
    <div
      className={style.cursorContainer}
      style={{ cursor: `url(${userEmoji}), auto` }}
      ref={containerRef}
    >
      {children}
      {recordedPositions.map((p) => {
        return (
          <div
            key={p.id}
            className={style.cursor}
            style={{
              left: p.x,
              top: p.y,
            }}
          >
            {cursorTypeToComponent(p.type)}
          </div>
        )
      })}
    </div>
  )
}

interface IUseCursorPositionsReturnValue {
  recordedPositions: ICursorPosition[]
  recordMyPosition: ReactMutation<API, 'sendCursorPosition'>
}

export const useCursorPositions = (): IUseCursorPositionsReturnValue => {
  // recorded positions
  const cursorPositionsQuery = useQuery('listCursorPositions')
  const recordedPositions: ICursorPosition[] =
    cursorPositionsQuery?.map((p) => ({
      id: p._id.toString(),
      x: p.x,
      y: p.y,
      type: p.type,
    })) ?? []

  // record myPosition
  const recordMyPosition = useMutation('sendCursorPosition')

  return {
    recordedPositions,
    recordMyPosition,
  }
}
