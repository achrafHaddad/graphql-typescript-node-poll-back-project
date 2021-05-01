import CreateError from 'http-errors';
import { Request } from 'express';

import { jwtr } from '../config/redis-init';
import { cacheUsers } from './cache.redis';

export const signAccessToken = async (userId: string) => {
  const payload = { jti: userId };
  const secret = 'super secret';
  const options = {
    expiresIn: '1d',
  };
  try {
    const token = await jwtr.sign(payload, secret, options);

    return token;
  } catch (error) {
    throw new CreateError.InternalServerError();
  }
};

export const authMiddleWare = async (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return new CreateError.Unauthorized();
  }

  const token = authHeader.split(' ')[1];
  if (token === undefined) {
    return new CreateError.Unauthorized();
  }
  try {
    const { jti } = await jwtr.verify(token, 'super secret');

    const user = await cacheUsers(jti);

    return { id: user._id };
  } catch (error) {
    return new CreateError.Unauthorized();
  }
};
