import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import ChannelService from '@services/channel.service';
import { IChannel, IInitialChannel } from '@/interfaces/channels.interface';

class ChannelsController {
  public channelService = new ChannelService();

  public getAllChannels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allChannels: IChannel[] = await this.channelService.getAllChannels()

      
      res.status(201).json({ data: allChannels, message: 'All channels fetched' });
    } catch (error) {
      next(error);
    }
  };

  public createChannel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const channelData: IInitialChannel = req.body

      const channel: IChannel = await this.channelService.createChannel(channelData)

      
      res.status(201).json({ data: channel, message: 'New channel created' });
    } catch (error) {
      next(error);
    }
  };

}

export default ChannelsController;
