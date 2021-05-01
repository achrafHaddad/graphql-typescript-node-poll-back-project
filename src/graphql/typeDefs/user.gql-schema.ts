import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile: User!
    users: [User!]!
    login(email: String!, password: String!): Auth
  }

  extend type Mutation {
    register(userInput: UserInputData): User
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    password: String!
  }

  input UserInputData {
    userName: String!
    email: String!
    password: String!
  }

  type Auth {
    message: String!
    token: String
  }
`;
