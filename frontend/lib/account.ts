import { useCookie } from 'next-cookie'
import Router, { useRouter } from "next/router";
import axios from "../plugins/axios";

const JWT_TOKEN = 'jwt_token'
const JWT_REFRESH_TOKEN = 'jwt_refresh_token'


// Setters
export const setJwtToken = (token) => {
    const cookie = useCookie()

    if(token) {
        cookie.set(JWT_TOKEN, token)
    } else {
        cookie.remove(JWT_TOKEN)
    }
}

export const setRefreshJwtToken = (token) => {
    const cookie = useCookie()
    
    if(token) {
        cookie.set(JWT_REFRESH_TOKEN, token)
    } else {
        cookie.remove(JWT_REFRESH_TOKEN)
    }
}

// Getters
export const getJwtToken = () => {
    const cookie = useCookie()
    return (cookie.has(JWT_TOKEN) ? cookie.get(JWT_TOKEN) : null) as string
}
export const getRefreshJwtToken = () => {
    const cookie = useCookie()
    return (cookie.has(JWT_REFRESH_TOKEN) ? cookie.get(JWT_REFRESH_TOKEN) : null) as string
}
export const isLoggedIn = () => {
    const cookie = useCookie()
    return cookie.has(JWT_REFRESH_TOKEN)
}

//Methods
export const signIn = async (username, password) => {
    const err: any = {}

    try {
        const res = await axios.post("/account/token/", {username, password})
        
        if(res.status == 200) {
            const {refresh, access} = res.data

            setJwtToken(access)
            setRefreshJwtToken(refresh)

            Router.push('/')
        } else {
            err.general = res.statusText
        }
    } catch(e) {
        const d = e.response.data

        err.username = d.username
        err.password = d.password
        err.general = d.detail ? "Bad login or password" : undefined
    }

    return err
}

export const signUp = async (firstName, lastName, email, username, password) => {
    let err: any = {}

    try {
        const res = await axios.post("/account/signup/", {first_name: firstName, last_name: lastName, email, username, password})

        if(res.status == 200) {
            signIn(username, password)
        } else {
            err.general = res.statusText
        }
    } catch(e) {
        const d = e.response.data

        err = {...d}
        err.general = d.detail ? "Bad login or password" : undefined
    }

    return err
}

export const refreshJwtToken = async () => {
    const refreshToken = getRefreshJwtToken()

    if(!refreshToken) {
        if(!['/signup', '/signin'].includes(Router.pathname)) {
            Router.push('/signin')
        }
    }

    try {
        const res = await axios.post('account/token/refresh/', {refresh: refreshToken})

        if(res.status == 200) {
            setJwtToken(res.data.access)
        } 
    } catch(e) {
        if(!['/signup', '/signin'].includes(Router.pathname)) {
            Router.push('/signin')
        }

        setRefreshJwtToken(null)
        setJwtToken(null)
    }
}

export const logout = async () => {
    setRefreshJwtToken(null)
    setJwtToken(null)

    Router.push('/signin')
}
