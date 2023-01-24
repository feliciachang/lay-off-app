import { FormEvent, useState } from 'react'
import { useMutation } from '../../convex/_generated/react'
import { validURL } from '../../utils'

interface UseMessageValues {
    emailText: string;
    setEmailText: (text: string) => void;
    handleSendMessage: (event: FormEvent) => Promise<void>;
    successMessage: string;
}

export default function useEmailForm(): UseMessageValues {
    const sendEmail = useMutation('sendEmail')

    const [emailText, setEmailText] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(true)
    const [successMessage, setSuccessMessage] = useState('')

    function validEmail(email: string) {
        return email.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }
    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()
        if(!validEmail(emailText)) {
            setIsValidEmail(false)
            setSuccessMessage('invalid email, please try again')
            return
        }
        setEmailText('')
        await sendEmail(emailText)
        setSuccessMessage('cool, email coming your way tomorrow')
    }

    return {
        emailText,
        setEmailText,
        handleSendMessage,
        successMessage,
    }
}