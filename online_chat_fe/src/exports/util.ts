import { json } from "stream/consumers";
import { REACT_APP_BE_HOST, REACT_APP_BE_PORT } from "../config";
import { IChannel } from "./types.common";
import Pusher from "pusher-js";

export const BACKEND_URL = `https://${REACT_APP_BE_HOST}${REACT_APP_BE_PORT}`



export const setCurrentChannel = (channel: IChannel) => {
    localStorage.setItem('channel', JSON.stringify(channel))
    document.dispatchEvent(new Event("storage"));
}

export const getCurrentChannel = ():IChannel | null => {
    const channel = localStorage.getItem('channel')
    if (channel) return JSON.parse(channel)
    else return null
}

export const pusher = new Pusher('f9393d264b73e6431690', {
    cluster: 'eu'
});
