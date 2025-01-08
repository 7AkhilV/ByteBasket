import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { UnprocessableEntity } from '../middlewares/validation';
import { SignUpSchema } from '../schema/users';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      next(
        new BadRequestsException(
          'User already exists',
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    } else {
      user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashSync(password, 10),
        },
      });
      res.json(user);
    }
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        'Unprocessable Entity',
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });
  //   if (!user || !compareSync(password, user.password)) {
  //     throw Error('Invalid email or password');
  //   }

  if (!user) {
    return next(
      new BadRequestsException(
        'Invalid email or password',
        ErrorCode.USER_NOT_FOUND
      )
    );
  }

  if (!compareSync(password, user.password)) {
    return next(
      new BadRequestsException(
        'Invalid email or password',
        ErrorCode.INCORRECT_PASSWORD
      )
    );
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET!);
  res.json({ user, token });
};
