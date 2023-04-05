import { useState } from 'react'
import styles from 'styles/twice.module.css'

export default function Twice(): JSX.Element {
  const [showControls, setShowControls] = useState(false)
  const [showAnd, setShowAnd] = useState(false)
  return (
    <div style={{ margin: '10px 100px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: `${showAnd ? 'center' : 'flex-start'}`,
        }}
      >
        <div
          className={styles.text}
          style={{ width: '500px', padding: '10px' }}
          onClick={() => {
            setShowControls(!showControls)
            setShowAnd(false)
          }}
          onMouseEnter={() => setShowAnd(true)}
          onMouseLeave={() => setShowAnd(false)}
        >
          <div
            style={{
              fontSize: '12px',
              marginBottom: '10px',
            }}
          >
            EARLY NOVEMBER 2022
          </div>
          <div style={{ marginBottom: '10px' }}>
            In the company I was working for, there was a mass layoff at the
            beginning of November, but I was on vacation. Whilst I was soaking
            up the sun, my colleagues were being laid off one by one.{' '}
          </div>
          <div style={{ fontSize: '18px' }}>
            I didn’t know what was going on until one of my colleagues messaged
            me to ask if I had been impacted. I didn’t know what to do as I was
            panicking but also didn’t have my work equipment with me. I tried to
            login to my work email but was denied access. My password had been
            changed a couple hours prior to me trying to login. I was stressed
            out and I didn’t know what to do. I looked at my personal email and
            saw that HR emailed about my role being potentially impacted or at
            risk of redundancy.
          </div>
        </div>
        {showAnd && (
          <div style={{ fontSize: '100px', color: 'blue', paddingLeft: '5px' }}>
            &
          </div>
        )}
        {showControls && (
          <form style={{ marginLeft: '20px', marginTop: '20px' }}>
            <input style={{ width: '400px' }} placeholder="add a comment..." />
          </form>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          className={styles.text}
          style={{ width: '500px', padding: '10px' }}
          onClick={() => setShowControls(!showControls)}
        >
          <div
            style={{
              fontSize: '12px',
              marginBottom: '10px',
            }}
          >
            EARLY NOVEMBER 2022
          </div>
          <div style={{ marginBottom: '10px' }}>
            In the company I was working for, there was a mass layoff at the
            beginning of November, but I was on vacation. Whilst I was soaking
            up the sun, my colleagues were being laid off one by one.{' '}
          </div>
          <div style={{ fontSize: '18px' }}>
            I didn’t know what was going on until one of my colleagues messaged
            me to ask if I had been impacted. I didn’t know what to do as I was
            panicking but also didn’t have my work equipment with me. I tried to
            login to my work email but was denied access. My password had been
            changed a couple hours prior to me trying to login. I was stressed
            out and I didn’t know what to do. I looked at my personal email and
            saw that HR emailed about my role being potentially impacted or at
            risk of redundancy.
          </div>
        </div>
        {showControls && (
          <form style={{ marginLeft: '2 0px', marginTop: '20px' }}>
            <input style={{ width: '400px' }} placeholder="add a comment..." />
          </form>
        )}
      </div>
    </div>
  )
}
