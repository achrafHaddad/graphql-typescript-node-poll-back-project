import { Request } from 'express';

import UserService, { InputFields } from './user.service';

export default {
  Query: {
    profile: async () => {
      console.log('profile');
    },
    users: async (_: any, args: any, { req }: { req: Request }) => {
      return await UserService.getUsers(req);
    },
    login: async (_: any, { email, password }: InputFields) => {
      return await UserService.login({ email, password });
    },
  },
  Mutation: {
    register: async (_: any, { userInput }: any) => {
      const { userName, password, email } = userInput;
      return await UserService.createUser({ userName, password, email });
    },
  },
};
