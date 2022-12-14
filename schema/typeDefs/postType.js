import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Post {
    id: Int!
    userId: Int!
    title: String!
    catagory: String!
    image: String!
    status: String!
    approvedBy: String!
    createdAt: String!
    owner: User!
    comments: [Comment!]
    likes: [Like!]
  }

  type Comment {
    id: Int!
    text: String!
    userId: Int!
    postId: Int!
    createdAt: String!
    user: User!
  }

  type Like {
    id: Int!
    userId: Int!
    postId: Int!
    user: User!
  }

  union Post_Error = User | Error

  type Query {
    getMyApprovedPosts: [Post!]
    getAllPosts: [Post!]
    getNewPosts: [Post!]
    getMyRevertedPosts: [Post!]
  }

  type Mutation {
    approvePost(id: Int!): Response
    rejectPost(id: Int!): Response
    returnPost(id: Int!): Response
    comment(id: Int, text: String!): Response
    like(id: Int!): Response
  }
`;

export default typeDefs;
