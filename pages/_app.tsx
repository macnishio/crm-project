import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import '../styles/globals.css'  // このパスを修正

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp