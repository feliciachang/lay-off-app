import { FormEvent, useState } from 'react'
import { useMutation } from '../../convex/_generated/react'
import { validURL } from '../../utils'

interface UseMessageValues {
    newMessageText: string;
    setNewMessageText: (text: string) => void;
    newMessageUrl: string;
    setNewMessageUrl: (text: string) => void;
    handleSendMessage: (event: FormEvent) => Promise<void>;
    isValidUrl: boolean;
    success: boolean;
}

export default function useQuickQuestionForm(roomId: string | null): UseMessageValues {
    const sendQuickQuestion = useMutation('sendQuickQuestion')

    const [newMessageText, setNewMessageText] = useState('')
    const [newMessageUrl, setNewMessageUrl] = useState('')
    const [isValidUrl, setIsValidUrl] = useState(true)
    const [success, setSuccess] = useState(false)

    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()
        if (newMessageUrl.length > 0 && !validURL(newMessageUrl)) {
          setIsValidUrl(false)
          return
        }
        setNewMessageText('')
        setNewMessageUrl('')
        setSuccess(true)
        await sendQuickQuestion(newMessageText, newMessageUrl, roomId)
    }

    return {
        newMessageText,
        setNewMessageText,
        newMessageUrl,
        setNewMessageUrl,
        handleSendMessage,
        isValidUrl,
        success
    }
}