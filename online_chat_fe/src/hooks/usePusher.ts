import axios from "axios"
import Pusher from "pusher-js";


const usePusher = () => {
    const pusher = new Pusher('f9393d264b73e6431690', {
      cluster: 'eu'
    });

    return {
      pusher
    }
}

export default usePusher