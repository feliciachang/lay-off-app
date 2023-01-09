import { useState, useEffect } from 'react'
import MessageContainer from './messages'

export default function App() {
  return (
    <main>
      <MessageContainer />
      <span>
        find felicia on <a href="https://twitter.com/felchang">twitter</a> and
        send her feature requests!
      </span>
    </main>
  )
}
