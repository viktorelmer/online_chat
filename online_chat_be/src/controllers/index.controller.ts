import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send("<h1>API version: 0.0.1</h1>");
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
