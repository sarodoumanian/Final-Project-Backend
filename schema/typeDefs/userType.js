import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: Int
    firstName: String!
    lastName: String!
    email: String!
    password: String
    profilePic: String
    role: String
    createdAt: String!
  }

  type Error {
    message: String!
  }

  type Response {
    message: String!
  }

  union User_Error = User | Error
  union Error_Response = Error | Response

  type Query {
    getProfile: User
    logout: Response!
  }

  type Mutation {
    register(firstName: String!, lastName: String!, email: String!, password: String!): User_Error!
    updateUser(id: String, firstName: String, lastName: String, phoneNumber: String, email: String): Error_Response!
    changePassword(oldPassword: String!, newPassword: String!, confirmPassword: String!): Error_Response!
    login(email: String!, password: String!): User_Error!
  }
`;

export default typeDefs;
