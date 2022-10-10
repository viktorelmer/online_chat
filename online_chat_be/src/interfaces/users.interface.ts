export interface InitalUser {
  username: string;
}

export interface User extends InitalUser {
  id: number;
  uuid: string;
}

export type IUuid = string;

export interface IRandomUser {
  login: {
    username: string;
  };
}

export interface IRandomUsersResponse {
  results: IRandomUser[];
}

