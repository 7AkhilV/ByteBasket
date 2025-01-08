import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // extract the token from the request headers
  const token = req.headers.authorization;
  // if the token is not present, throw an error
  if (!token) {
    return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
  // if the token is present, decode the token and attach the user to the request object
  try {
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
