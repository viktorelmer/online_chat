import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const UUID = req.cookies['UUID'] || (req.header('UUID') ? req.header('UUID') : null);
    
    if (UUID) {
      const findUser = await UserEntity.find({where: {uuid: UUID}});
      if (findUser.length) {
        next()
      } else {
        next(new HttpException(401, 'UUID authentication token'));
      }
    } else {
      next(new HttpException(404, 'UUID token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong UUID token'));
  }
}

// disabled for some time
const DisabledAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['UUID'] || (req.header('UUID') ? req.header('UUUID') : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const findUser = await UserEntity.findOne(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
