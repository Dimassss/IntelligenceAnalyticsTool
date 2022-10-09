import axios from 'axios'
import { getJwtToken, refreshJwtToken } from '../lib/account'
import { isExpired } from "react-jwt";
import Router from 'next/router';

const axiosAuth = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
})

axiosAuth.interceptors.request.use(async config => {
    let token = getJwtToken()
    
    if(token !== null) {
        const expired = isExpired(token as string);

        if(expired || !token) {
            await refreshJwtToken()
            token = getJwtToken()
        }

        if(token) {
            config.headers.common["Authorization"] = `Bearer ${token}`
        }
    } else {

        if(!['/signin', '/signup'].includes(Router.pathname)) {
            Router.push('/signin')
        }
    }

    return config
})


export default axiosAuth