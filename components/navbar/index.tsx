import styles from './index.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Navbar(): JSX.Element {
  let [squishText, setSquishText] = useState(false)
  const { push } = useRouter()
  return (
    <div
      className={styles.navbar}
      onMouseEnter={() => setSquishText(true)}
      onMouseLeave={() => setSquishText(false)}
      onClick={() => push('home')}
    >
      {squishText ? (
        <p style={{ display: 'flex', justifyContent: 'center' }}>off&co</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <p>o</p>
          <p>f</p>
          <p>f</p>
          <p>&</p>
          <p>c</p>
          <p>o</p> */}
          <p>off</p>
          <p>&</p>
          <p>co</p>
        </div>
      )}
    </div>
  )
}
