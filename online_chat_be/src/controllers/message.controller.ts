import { NextFunction, Request, Response } from 'express';
import MessageService from '@/services/message.service';
import { IInitMessage, IMessage, IMessageEntity, IMessageResponse } from '@/interfaces/messages.interface';

class MessagesController {
  public messageService = new MessageService();

  public getMessagesByChannelId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const channelId = req.params.channelId;

      const messages: IMessageResponse[] = await this.messageService.getMessagesByChannelId(Number(channelId))

      
      res.status(201).json({ data: messages, message: 'all messages by channel id' });
    } catch (error) {
      next(error);
    }
  };

  public addNewMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageData: IMessageEntity = req.body

      const messages: IMessage = await this.messageService.sendMessageToChannel(messageData)

      
      res.status(201).json({ data: messages, message: 'Message was added' });
    } catch (error) {
      next(error);
    }
  };
}

export default MessagesController;
