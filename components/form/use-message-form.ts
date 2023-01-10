import { FormEvent, useState } from 'react'
import { useMutation } from '../../convex/_generated/react'
import validURL from '../../utils/valid-url'

interface UseMessageValues {
    newMessageText: string;
    setNewMessageText: (text: string) => void;
    newMessageUrl: string;
    setNewMessageUrl: (text: string) => void;
    handleSendMessage: (event: FormEvent) => Promise<void>;
    isValidUrl: boolean;
}

export default function useMessageForm(): UseMessageValues {
    const sendMessage = useMutation('sendMessage')

    const [newMessageText, setNewMessageText] = useState('')
    const [newMessageUrl, setNewMessageUrl] = useState('')
    const [isValidUrl, setIsValidUrl] = useState(true)

    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()
        if (newMessageUrl.length > 0 && !validURL(newMessageUrl)) {
          setIsValidUrl(false)
          return
        }
        setNewMessageText('')
        setNewMessageUrl('')
        await sendMessage(newMessageText, '', newMessageUrl)
    }

    return {
        newMessageText,
        setNewMessageText,
        newMessageUrl,
        setNewMessageUrl,
        handleSendMessage,
        isValidUrl,
    }
}