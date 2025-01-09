import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == 'ADMIN') {
    next();
  } else {
    next(
      new UnauthorizedException(
        'You are not authorized to perform this action',
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default adminMiddleware;
