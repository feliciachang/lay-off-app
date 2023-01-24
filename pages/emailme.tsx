import GenericForm from '../components/form/generic-form'
import useEmailForm from '../components/form/use-email-form'

export default function EmailMe() {
  const { emailText, setEmailText, successMessage, handleSendMessage } =
    useEmailForm()
  return (
    <main>
      <p>get a real email from felicia.</p>
      <p>{`not an ugly mailchimp email (yet).`}</p>
      <GenericForm
        emailText={emailText}
        setEmailText={setEmailText}
        submitMessage={successMessage}
        handleSubmit={handleSendMessage}
      />
    </main>
  )
}
