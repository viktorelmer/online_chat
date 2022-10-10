import React from "react";

import Cookies from 'js-cookie'
import axios from 'axios'
import useAxios from './useAxios'
import { BACKEND_URL } from '../exports/util'
import { IUser, IUserLogin } from '../exports/types.common'

const useAuthHook = () => {
    const { send } = useAxios(BACKEND_URL)
    const [isAuth, setIsAuth] = React.useState(false)
    const [UUID, setUUID] = React.useState<string | undefined | null>(Cookies.get('UUID'))
    const [userData, setUserData] = React.useState<IUser>()

    const authenticate = () => {
        if (!UUID) {
            send<IUser>('post', '/signup').then(res => {
                const uuid = res.data.data.uuid
                send<IUser, IUserLogin>('post', '/login', {uuid}).then(res => {
                    setUUID(uuid)
                    setIsAuth(true)
                    setUserData({...res.data.data})
                    Cookies.set('UUID', uuid)
                    axios.defaults.headers.common['UUID'] = uuid
                })
            })
        } else {
            send<IUser, IUserLogin>('post', '/login', {uuid: UUID}).then((res) => {
                setUserData({...res.data.data})
                setIsAuth(true)
                axios.defaults.headers.common['UUID'] = UUID
            })
        }
    }
    
    return {
        userData,
        UUID,
        isAuth,
        authenticate
    }
}

export default useAuthHook