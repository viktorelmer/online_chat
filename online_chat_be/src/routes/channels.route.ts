import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ChannelsController from '@controllers/channels.controller';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateChannelDto } from '@/dtos/channels.dto';

class ChannelsRoute implements Routes {
  public path = '/channels';
  public router = Router();
  public channelsController = new ChannelsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, authMiddleware, this.channelsController.getAllChannels);
    this.router.post(`${this.path}/new`, [authMiddleware, validationMiddleware(CreateChannelDto, 'body')], this.channelsController.createChannel);
  }
}

export default ChannelsRoute;
