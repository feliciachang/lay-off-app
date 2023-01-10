import { FormEvent, useState } from 'react'
import { useMutation } from '../../convex/_generated/react'
import { validURL } from '../../utils'

interface UseResponseValues {
    newResponseText: string;
    setNewResponseText: (text: string) => void;
    newResponseUrl: string;
    setNewResponseUrl: (text: string) => void;
    handleSendResponse: (event: FormEvent) => Promise<void>;
    isValidUrl: boolean;
}

export default function useResponseForm(messageId: string): UseResponseValues {
    const [newResponseText, setNewResponseText] = useState('')
    const [newResponseUrl, setNewResponseUrl] = useState('')
    const [isValidUrl, setIsValidUrl] = useState(true)
    const sendResponse = useMutation('sendResponse')

    async function handleSendResponse(event: FormEvent) {
        event.preventDefault()
        if (newResponseUrl.length > 0 && !validURL(newResponseUrl)) {
          setIsValidUrl(false)
          return
        }
        setNewResponseText('')
        setNewResponseUrl('')
        await sendResponse(messageId, newResponseText, '', newResponseUrl)
      }
    

    return {
        newResponseText,
        setNewResponseText,
        newResponseUrl,
        setNewResponseUrl,
        handleSendResponse,
        isValidUrl,
    }
}