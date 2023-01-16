import React, { useState } from 'react'

interface IError {
  message: string
}

interface IUseFormProps<P> {
  initialValue: P
  validate: (p: P) => Array<IError>
  onValid: (p: P) => void
}

interface IUseFormRet<P> {
  formValues: P
  setFormValues: React.Dispatch<React.SetStateAction<P>>
  errors: Array<IError>
  submitForm: (p: P) => void
}

export const useForm = <P>(props: IUseFormProps<P>): IUseFormRet<P> => {
  const { initialValue, validate, onValid } = props

  const [formValues, setFormValues] = useState<P>(initialValue)
  const [errors, setErrors] = useState<Array<IError>>([])

  const submitForm = (p: P) => {
    // validate
    const errors = validate(p)
    setErrors(errors)

    // do whatever else
    onValid(p)
  }

  return {
    formValues,
    setFormValues,
    submitForm,
    errors,
  }
}
