export default {
    build: {
        babel: {
          presets({isServer}) {
                const targets = isServer ? { node: 'current' } : { ie: 11 }
                return [
                    [ require.resolve("@babel/preset-env"), { targets }  ]
                ]
            },
            plugins: [
                "@babel/syntax-dynamic-import",
                "@babel/transform-runtime",
                "@babel/transform-async-to-generator"
            ]
        },
    },
    modules: ['@nuxtjs/axios'],
    axios: {
        baseURL: 'http://localhost:8000/',
        headers: {
            common: {}
        }
    }
}