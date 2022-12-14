import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    getAdmins: [User]
  }

  type Mutation {
    createAdmin(firstName: String!, lastName: String!, email: String!, password: String!): User_Error!
  }
`;

export default typeDefs;
