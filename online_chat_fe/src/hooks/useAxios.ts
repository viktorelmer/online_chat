import axios from "axios"

import { AxiosResponse, IHeaders, ReqTypes } from "../exports/types.common"

const useAxios = (defaultUrl?: string) => {

    async function send<DataType, SentData = any>(type: ReqTypes, url: string, data?: DataType | SentData | null, headers?: IHeaders) {
        return axios[type]<AxiosResponse<DataType>>(defaultUrl ? defaultUrl + url : url, data, { headers })
    }

    return {
        send
    }
}

export default useAxios