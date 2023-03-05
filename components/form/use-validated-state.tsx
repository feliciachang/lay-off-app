import React, { useState } from 'react'
import { useMutation } from '../../convex/_generated/react'
import { validURL } from '../../utils'

interface IError {
  errMsg: string
}

interface IUseValidatedStateProps<T> {
  initialState: T
  validate?: (state: T) => Array<IError>
  onValid?: (state: T) => void
}

interface IUseValidatedStateRet<T> {
  state: T
  setState: React.Dispatch<React.SetStateAction<T>>
  errors: Array<IError>
}

export const useValidatedState = <T,>(
  props: IUseValidatedStateProps<T>
): IUseValidatedStateRet<T> => {
  const { initialState, validate, onValid } = props

  const [state, _setState] = useState<T>(initialState)
  const [errors, setErrors] = useState<Array<IError>>([])

  // this function is a proxy for _setValidatedState
  const setState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    if (value instanceof Function) {
      _setState((prev) => {
        const next = value(prev)
        let errors: IError[] = []
        if (typeof validate !== 'undefined') {
          errors = validate(next)
        }
        setErrors(errors)
        if (errors.length === 0) {
          if (typeof onValid !== 'undefined') {
            onValid(next)
          }
          return next
        } else {
          return prev
        }
      })
    } else {
      let errors: IError[] = []
      if (typeof validate !== 'undefined') {
        errors = validate(value)
      }
      setErrors(errors)
      if (errors.length === 0) {
        _setState(value)
        if (typeof onValid !== 'undefined') {
          onValid(value)
        }
      }
    }
  }

  return {
    state,
    setState,
    errors,
  }
}

const TestComponent = () => {
  const sendMessage = useMutation('sendMessage')
  const roomId = 'eruh'

  const { state, setState, errors } = useValidatedState({
    initialState: {
      message: '',
      url: '',
    },
    validate: (value) => {
      const errors = []
      if (value.url.length < 1 || !validURL(value.url)) {
        errors.push({
          errMsg: 'URL is not of length > 0 or is not valid',
        })
      }
      return errors
    },
  })

  const handleSendMessage = () => {
    if (errors.length === 0) {
      sendMessage(state.message, '', state.url, roomId)
    }
  }

  return (
    <div>
      {/* message input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
      >
        <input
          type="text"
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
        />
        {/* url input */}
        <input
          type="text"
          value={state.url}
          onChange={(e) => setState({ ...state, url: e.target.value })}
        />
        {/* submit button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
