import Image from 'next/image'
import Text from '../../design-system/text/text'

interface SubresponseBodyProps {
  body: string
  url: string
}

export default function SubresponseBody(
  props: SubresponseBodyProps
): JSX.Element {
  const { body, url } = props

  return (
    <div
      style={{
        fontSize: '18px',
        display: 'flex',
        color: '#D0D0D0',
      }}
    >
      <Image
        style={{ color: '#D0D0D0' }}
        src="/dropdown-arrow.svg"
        alt="arrow"
        width={15}
        height={15}
      />
      <span style={{ paddingLeft: '3px' }}>
        <Text type="subresponse" text={body} maxChar={250} url={url} />
      </span>
    </div>
  )
}
