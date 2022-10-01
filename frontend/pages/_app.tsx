import { ChakraProvider } from '@chakra-ui/react'
import { wrapper } from "../store/store";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default wrapper.withRedux(MyApp);