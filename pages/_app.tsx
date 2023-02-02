import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from '../convex/_generated/clientConfig'
import { CursorRenderer } from '../utils/cursors'
const convex = new ConvexReactClient(clientConfig)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <CursorRenderer>
        <Component {...pageProps} />
      </CursorRenderer>
      <Analytics />
    </ConvexProvider>
  )
}

export default MyApp
