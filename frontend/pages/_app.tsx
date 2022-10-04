import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head';
import { wrapper } from "../store/store";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    
    <ChakraProvider>
      <Head>
        {
          // Because I want this page as desktop-only. If you are from phone, so screen will be displayed as desktop's.
        }
        <meta name="viewport" content="width=1080, user-scalable=1"></meta>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default wrapper.withRedux(MyApp);