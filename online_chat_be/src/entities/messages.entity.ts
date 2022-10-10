import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { IMessage } from '@/interfaces/messages.interface';
import { ChannelEntity } from './channels.entity';
import { UserEntity } from './users.entity';

@Entity()
export class MessageEntity extends BaseEntity implements IMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => UserEntity, user => user.id)
  user_id: number;

  @Column()
  text: string;

  @Column()
  @OneToOne(() => ChannelEntity, ChannelEntity => ChannelEntity.id)
  channel_id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
