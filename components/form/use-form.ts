import React, { useState } from 'react'

interface IError {
  message: string
}

interface IUseFormProps<T> {
  initialValue: T
  validate: (formValue: T) => Array<IError>
  onValid: (formValue: T) => void
}

interface IUseFormRet<T> {
  formValue: T
  setFormValue: React.Dispatch<React.SetStateAction<T>>
  errors: Array<IError>
  submitForm: (formValue: T) => void
}

export const useForm = <T>(props: IUseFormProps<T>): IUseFormRet<T> => {
  const { initialValue, validate, onValid } = props

  const [formValue, setFormValue] = useState<T>(initialValue)
  const [errors, setErrors] = useState<Array<IError>>([])

  const submitForm = (formValue: T) => {
    // validate
    const errors = validate(formValue)
    setErrors(errors)

    // do whatever else
    onValid(formValue)
  }

  return {
    formValue,
    setFormValue,
    submitForm,
    errors,
  }
}
