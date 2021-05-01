import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    polls: [Poll]!
    getPoll: Poll!
  }

  extend type Mutation {
    createPoll(pollInput: PollInput): Poll!
    vote(pollId: String!, voteType: Boolean!): Poll!
    updatePoll(pollInput: PollInput): Poll!
    deletePoll(pollId: String!): Message
  }

  type Subscription {
    subToVote: Poll!
    subToCreate: Poll!
  }

  input PollInput {
    name: String!
    description: String!
  }

  type Message {
    message: String!
  }

  type Poll {
    id: ID!
    name: String!
    description: String!
    totalVotes: Int
    yesVotes: Int
    userId: ID!
    voters: [ID]!
  }
`;
