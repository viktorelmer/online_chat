import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { InitalUser, User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import UserService from './users.service';



@EntityRepository()
class AuthService extends Repository<UserEntity> {
  public async signup(): Promise<User> {
    const username = await UserService.getRandomUsername(),
      uuid = await UserService.createUserUUID();

    const createUserData: User = await UserEntity.create({ username, uuid }).save();
    return createUserData;
  }

  public async login(uuid: string): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(uuid)) throw new HttpException(400, "uuid is empty");

    const findUser: User = await UserEntity.findOne({ where: { uuid } });
    if (!findUser) throw new HttpException(409, `This uuid ${uuid} was not found`);

    const cookie = this.createCookie(uuid);

    return { cookie, findUser };
  }

  public async logout(uuid: string): Promise<User> {
    if (isEmpty(uuid)) throw new HttpException(400, "uuid is empty");

    const findUser: User = await UserEntity.findOne({ where: { uuid } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(uuid: string): string {
    return `UUID=${uuid};`;
  }
}

export default AuthService;
