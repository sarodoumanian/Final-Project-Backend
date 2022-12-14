import { ApolloError } from 'apollo-server-express';

import User from '../../models/user.js';

const adminResolver = {
  Query: {
    async getAllUsers() {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    async getUserById(_, { id }) {
      try {
        const user = await User.findOne({ where: { id }, attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'] });
        if (user) {
          return {
            __typename: 'User',
            ...user.dataValues
          };
        }
      } catch (error) {
        console.log(error);
        throw new ApolloError(error);
      }
    }
  },
  Mutation: {
    async updateUserById(_, args) {
      const obj = {};
      args.firstName && (obj.firstName = args.firstName);
      args.lastName && (obj.lastName = args.lastName);
      args.email && (obj.email = args.email);
      args.phoneNumber && (obj.phoneNumber = args.phoneNumber);
      try {
        if (args.email) {
          const existingUser = await User.findOne({ where: { email: args.email } });
          if (existingUser) {
            return {
              __typename: 'Error',
              message: 'This email is taken'
            };
          }
        }
        await User.update(obj, { where: { id: args.id } });
        return {
          __typename: 'Response',
          message: 'User updated sucessfully'
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export default adminResolver;
