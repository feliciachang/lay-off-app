import { ReactMutation } from 'convex/dist/types/react/react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useMouse } from 'react-use'
import { API } from '../../convex/_generated/api'
import { useMutation, useQuery } from '../../convex/_generated/react'
import style from './index.module.css'
import {
  convertStringToICursorType,
  ICursorPosition,
  ICursorType,
} from './utils'

/**
 * CursorRender records user's cursor clicks
 * and also renders existing cursor positions in the database
 */
export const CursorRenderer = (props: React.PropsWithChildren<{}>) => {
  const { children } = props
  const { recordMyPosition, recordedPositions } = useCursorPositions()

  const containerRef = useRef(null)
  const { elX, elY } = useMouse(containerRef)

  const onClick = useCallback(() => {
    recordMyPosition(
      elX,
      elY,
      ICursorType.Happy /* cursor type doesn't do anything yet */
    )
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
    <div className={style.cursorContainer} ref={containerRef}>
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
          />
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
      type: convertStringToICursorType(p.type),
    })) ?? []

  // record myPosition
  const recordMyPosition = useMutation('sendCursorPosition')

  return {
    recordedPositions,
    recordMyPosition,
  }
}
