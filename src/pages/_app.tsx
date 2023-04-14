import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import '../styles/global.scss'
import { Header } from '@/components/Header'

const initialOptions = {
  "client-id": "AVvFED-1Inzu1XS0g48J4n-MvJDozvXmB3pAvib2tZrTxn_Er6rVoSaUc5yf99J3UfRBIBcAovAUkFHB",
  currency: "BRL",
  intent: "capture"
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
      <SessionProvider session={session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
        
      </SessionProvider>
  )
}
