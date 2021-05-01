import user from './user/user.resolver';
import poll from './poll/poll.resolver';

export default {
  Query: {
    ...user.Query,
    ...poll.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...poll.Mutation,
  },
  Subscription: {
    ...poll.Subscription,
  },
};
