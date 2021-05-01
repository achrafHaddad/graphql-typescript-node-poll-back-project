import CreateError from 'http-errors';

import { client, getClientAsync } from '../config/redis-init';
import User from '../models/user.schema';

export const cacheUsers = async (id: string) => {
  try {
    const res = await getClientAsync('user:' + id);
    if (res) return JSON.parse(res);

    const user = await User.findById(id);
    if (!user) return new CreateError.Unauthorized();
    client.setex('user:' + user._id, 3600 * 24, JSON.stringify(user));

    return user;
  } catch (error) {
    return error;
  }
};
