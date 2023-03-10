import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ClerkProvider } from '@clerk/nextjs'
import clientConfig from '../convex/_generated/clientConfig'
import { CursorRenderer } from '../components/cursors'
import { useFlags } from '../flags/client'

const convex = new ConvexReactClient(clientConfig)

function MyApp({ Component, pageProps }: AppProps) {
  const flags = useFlags()
  const ffInteractiveCursors = flags.data?.flags['interactive-cursors']

  return (
    <ClerkProvider {...pageProps}>
      <ConvexProvider client={convex}>
        {ffInteractiveCursors ? (
          <CursorRenderer>
            <Component {...pageProps} />
          </CursorRenderer>
        ) : (
          <Component {...pageProps} />
        )}
        <Analytics />
      </ConvexProvider>
    </ClerkProvider>
  )
}

export default MyApp
