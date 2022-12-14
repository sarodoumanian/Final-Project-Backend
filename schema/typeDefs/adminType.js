import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    getAllUsers: [User!]!
    getUserById(id: Int!): User
  }

  type Mutation {
    updateUserById(id: Int, firstName: String, lastName: String, phoneNumber: String, email: String): Error_Response!
  }
`;

export default typeDefs;
