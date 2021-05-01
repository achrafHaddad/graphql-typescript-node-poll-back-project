import bcrypt from 'bcrypt';
import CreateError from 'http-errors';
import { Request } from 'express';

import { User } from '../../../models';
import { signAccessToken, authMiddleWare } from '../../../middleware/jwt.redis';

export interface InputFields {
  userName?: string;
  email: string;
  password: string;
}

export default class UserService {
  static async getUsers(req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      return await User.find();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static async createUser({ userName, email, password }: InputFields) {
    try {
      const userExist = await User.findOne({ email });
      if (userExist) return new CreateError.Conflict('email already exist');

      const salt = await bcrypt.genSalt(10);
      const hashPasword = await bcrypt.hash(password, salt);

      const user = new User({
        userName: userName,
        email: email,
        password: hashPasword,
      });

      return await user.save();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static async login({ email, password }: InputFields) {
    try {
      const user = await User.findOne({ email });
      if (!user) return new CreateError.Unauthorized('incorrect email/password');

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return new CreateError.Unauthorized('incorrect email/password');

      const token = await signAccessToken(user._id);

      return { message: 'logged successfully', token };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
}
