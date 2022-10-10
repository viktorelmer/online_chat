import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import MessagesController from '@/controllers/message.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { AddMessageDto } from '@/dtos/messages.dto';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:channelId`, authMiddleware, this.messagesController.getMessagesByChannelId);
    this.router.post(`${this.path}/new`, [authMiddleware, validationMiddleware(AddMessageDto, 'body')], this.messagesController.addNewMessage);
  }
}

export default MessagesRoute;
