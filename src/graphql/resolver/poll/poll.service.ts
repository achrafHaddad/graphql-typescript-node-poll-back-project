import CreateError from 'http-errors';
import { Request } from 'express';
import { PubSubEngine } from 'graphql-subscriptions';

import { Poll } from '../../../models';
import { authMiddleWare } from '../../../middleware/jwt.redis';

export interface PollInput {
  name: string;
  description: string;
}

export default class PollService {
  static async createPoll({ name, description }: PollInput, req: Request, pubSub: PubSubEngine) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const pollExist = await Poll.findOne({ name });
      if (pollExist) return new CreateError.Conflict('Poll name alredy exist');

      const newPoll = new Poll({
        name,
        description,
        userId: data.id,
      });
      await newPoll.save();

      pubSub.publish('NEW_POLL', { subToCreate: newPoll });

      return newPoll;
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static async vote(pollId: string, voteType: boolean, req: Request, pubSub: PubSubEngine) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const poll = await Poll.findById(pollId);
      if (!poll) return new CreateError.NotFound('poll not found');

      if (poll.userId == data.id.toString()) return new CreateError.Forbidden('can not vote on your own poll');

      if (poll.voters.includes(data.id)) return new CreateError.Conflict('already voted');

      const totalVotes = ++poll.totalVotes;
      const yesVotes = voteType ? ++poll.yesVotes : poll.yesVotes;

      const updatedVote = await Poll.findByIdAndUpdate(
        pollId,
        { $push: { voters: data.id }, totalVotes, yesVotes },
        { new: true }
      );

      pubSub.publish('NEW_VOTE', { subToVote: updatedVote });

      return updatedVote;
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static async getAllPolls(req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      return await Poll.find();
    } catch (error) {
      new CreateError.NotFound(error.message);
    }
  }

  static async updatePol({ name, description }: PollInput, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const poll = await Poll.findOne({ name, userId: data.id });
      if (!poll) return new CreateError.NotFound('Poll does not exist');
      if (poll.totalVotes) return new CreateError.Conflict('can not edit a poll with votes');

      return await Poll.findOneAndUpdate({ name }, { name, description }, { new: true });
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static async deletePoll(pollId: string, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      await Poll.deleteOne({ _id: pollId, userId: data.id });
      return { message: 'poll deleted' };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }

  static subscribeToVotes(pubSub: PubSubEngine) {
    return pubSub.asyncIterator('NEW_VOTE');
  }

  static subscribeToCreate(pubSub: PubSubEngine) {
    return pubSub.asyncIterator('NEW_POLL');
  }
}
