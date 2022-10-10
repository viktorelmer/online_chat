import { MessageEntity } from '@/entities/messages.entity';
import { UserEntity } from '@/entities/users.entity';
import { HttpException } from '@/exceptions/HttpException';
import { IInitMessage, IMessage, IMessageEntity, IMessageResponse } from '@/interfaces/messages.interface';
import { isEmpty } from 'class-validator';
import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';
import PusherService from './pusher.service';

@EntityRepository()
class MessageService extends Repository<MessageEntity> {
  private pusherService = new PusherService()
	
  public async getMessagesByChannelId(channelId: number): Promise<IMessageResponse[]> {
    if (isEmpty(channelId)) throw new HttpException(400, "Channel id is empty");
    const messages = (await createQueryBuilder()
    .select('messages')
    .from(MessageEntity, 'messages')
    .where("messages.channel_id = :channelId", { channelId })
    .leftJoinAndMapOne('messages.user_id', UserEntity, 'user', 'user.id = messages.user_id')
    .getMany()) as unknown as IMessageResponse[]

    return messages;
  }

  public async sendMessageToChannel(messageData: IMessageEntity): Promise<IMessage> {
    if (isEmpty(messageData)) throw new HttpException(400, "Message data is empty");
    const user = await UserEntity.find({where: {uuid: messageData.UUID}})

    if (isEmpty(user[0])) throw new HttpException(400, "User not found");

    const message = new MessageEntity()

    message.channel_id = messageData.channel_id
    message.text = messageData.text
    message.user_id = user[0].id

    const newMessage = await message.save()

    this.pusherService.sendMessage(user[0], newMessage)
    return newMessage
  }
}

export default MessageService