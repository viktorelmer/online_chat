import { User } from "./users.interface";

export interface IInitMessage {
	text: string;
	channel_id: number;
}

export interface IMessage extends IInitMessage {
  id: number;
}

export interface IMessageEntity extends IInitMessage {
	UUID: number;
}

export interface IMessageResponse extends IMessage {
	user_id: User
}