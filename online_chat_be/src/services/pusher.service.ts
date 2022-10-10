import { HttpException } from '@/exceptions/HttpException'
import { IChannel } from '@/interfaces/channels.interface'
import { IMessage } from '@/interfaces/messages.interface'
import { User } from '@/interfaces/users.interface'
import Pusher from 'pusher'
const pusher = new Pusher({
        appId: "1489192",
        key: "f9393d264b73e6431690",
        secret: "f5a78c1e52706d206130",
        cluster: "eu",
        useTLS: true
    })

class PusherService {
    
    public async sendMessage(user: User, message: IMessage) {
        await pusher.trigger(`channel-${message.channel_id}`, 'send-message', {
            user: user,
            message: message
        }).catch((err) => {
            throw new HttpException(400, err)
        })
        return 'sended'
    }

    public async createChannel(channel: IChannel) {
        await pusher.trigger('new-channels', 'new-channel-created', channel).catch((err) => {
            throw new HttpException(400, err)
        })
        return 'Channel created'
    }
}

export default PusherService