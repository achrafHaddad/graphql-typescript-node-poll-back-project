import { GraphQLError } from 'graphql';

const formatGraphQLErrors = (error: GraphQLError) => {
  if (!error.originalError) return error;

  const message = error.message || 'An error occured';
  // @ts-ignore
  const status = error.originalError.status || 500;

  return { message, status };
};

export default formatGraphQLErrors;
