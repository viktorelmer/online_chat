import useSWR, { SWRResponse } from "swr"
import { BACKEND_URL } from "../exports/util"
import { AxiosResponse, ReqTypes, ResponseError } from "../exports/types.common"
import useAxios from "./useAxios"

function useSWRCustom<T>(type: ReqTypes, url: string | null, data?: any, shouldRetryOnError: boolean = true): SWRResponse<AxiosResponse<T>, ResponseError> {
    const { send } = useAxios()

    const request = (url_f: string) => {
        
        return send(type, url_f, data).then(res => res.data)
    }

    const fullURL = url ? BACKEND_URL + url : null
    
    return useSWR<AxiosResponse<T>, ResponseError>(fullURL, request, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    })
}

export default useSWRCustom