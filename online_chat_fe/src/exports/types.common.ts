// MESSAGE TYPES

export interface IInitMessage {
	text: string;
	channel_id: number;
}


export interface ISendMessage extends IInitMessage {
	UUID: string
}

export interface IMessage extends IInitMessage {
  username?: string;
  user_id: IUser;
  id: number;
  createdAt: string,
  updatedAt?: string,
}


// CHANNEL TYPES

export interface IEmptyChannel {
  name: null;
}

export interface IInitialChannel {
  name: string;
}

export interface IChannel extends IInitialChannel {
  id: number;
}

// HTTP TYPES

export interface AxiosResponse<T> {
  data: T,
  message: string
}

export interface ResponseError {
	response: {
		data: {
			message: string;
		}
	}
}

export type ReqTypes = 'post' | 'get'

export interface IHeaders {
	[key: string]: string
}

// USER TYPES

export interface IInitalUser {
  username: string;
}

export interface IUser extends IInitalUser {
  id: number;
  uuid: string;
}

export interface IUserLogin {
  uuid: string
}

// OTHER

export type MessageTypes = 'first' | 'last' | 'middle' | 'one'