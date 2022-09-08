<template>
  <CThemeProvider>
    <CReset />
    <Nuxt />
  </CThemeProvider>
</template>

<script>
import { CThemeProvider, CReset, CButton } from '@chakra-ui/vue'

export default {
  name: 'DefaultLayout',
  components: {
    CThemeProvider,
    CReset,
    CButton
  }
}
</script>