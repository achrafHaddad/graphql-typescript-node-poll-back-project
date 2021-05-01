import { Request } from 'express';
import { PubSubEngine } from 'graphql-subscriptions';

// import { pubSub } from '../../../index';
import PollService, { PollInput } from './poll.service';

export default {
  Query: {
    polls: async (_: any, __: any, { req }: { req: Request }) => {
      return await PollService.getAllPolls(req);
    },
  },
  Mutation: {
    createPoll: async (
      _: any,
      { pollInput: { name, description } }: { pollInput: PollInput },
      { req, pubSub }: { req: Request; pubSub: PubSubEngine }
    ) => {
      return await PollService.createPoll({ name, description }, req, pubSub);
    },
    vote: async (
      _: any,
      { pollId, voteType }: { pollId: string; voteType: boolean },
      { req, pubSub }: { req: Request; pubSub: PubSubEngine }
    ) => {
      return await PollService.vote(pollId, voteType, req, pubSub);
    },
    updatePoll: async (
      _: any,
      { pollInput: { name, description } }: { pollInput: PollInput },
      { req }: { req: Request }
    ) => {
      return await PollService.updatePol({ name, description }, req);
    },
    deletePoll: async (_: any, { pollId }: { pollId: string }, { req }: { req: Request }) => {
      console.log(pollId);

      return await PollService.deletePoll(pollId, req);
    },
  },
  Subscription: {
    subToVote: {
      subscribe: (_: any, __: any, { pubSub }: { pubSub: PubSubEngine }) => PollService.subscribeToVotes(pubSub),
    },
    subToCreate: {
      subscribe: (_: any, __: any, { pubSub }: { pubSub: PubSubEngine }) => PollService.subscribeToCreate(pubSub),
    },
  },
};
