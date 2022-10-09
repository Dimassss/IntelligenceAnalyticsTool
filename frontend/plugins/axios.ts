import a from 'axios'

const axios = a.create({
    baseURL: 'http://localhost:8000/'
})

export default axios