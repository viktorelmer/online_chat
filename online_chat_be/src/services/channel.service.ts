import { ChannelEntity } from '@/entities/channels.entity';
import { HttpException } from '@/exceptions/HttpException';
import { IChannel, IInitialChannel } from '@/interfaces/channels.interface';
import { isEmpty } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import PusherService from './pusher.service';

@EntityRepository()
class ChannelService extends Repository<ChannelEntity> {
  private pusherService = new PusherService()
	
  public async getAllChannels(): Promise<IChannel[]> {
    const channels = await ChannelEntity.find();
		if (!channels) throw new HttpException(400, 'Channels is empty');

    return channels;
  }


  public async createChannel(channelData: IInitialChannel): Promise<ChannelEntity> {
    if (isEmpty(channelData)) throw new HttpException(400, 'Channels data is empty');

    const channels = await ChannelEntity.find({where: {name: channelData.name}})
    if (channels.length) throw new HttpException(400, 'Channels with this name already exist');

    const channel = new ChannelEntity()
    channel.name = channelData.name


    const newChannel = await channel.save()
    this.pusherService.createChannel(newChannel)
    return newChannel
  }
}

export default ChannelService