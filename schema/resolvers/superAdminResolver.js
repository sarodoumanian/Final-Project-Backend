// import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import User from '../../models/user.js';

const superAdminResolver = {
  Query: {
    async getAdmins() {
      try {
        const admins = await User.findAll({ where: { role: 'admin' }, attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'] });
        // console.log(admins);
        return admins;
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    async createAdmin(_, { firstName, lastName, email, password }) {
      try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return {
            __typename: 'Error',
            message: 'email already taken'
          };
        }
        const hash = await bcrypt.hash(password, 8);
        const admin = await User.create({ firstName, lastName, email, password: hash, role: 'admin' });
        return {
          __typename: 'User',
          ...admin.dataValues
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export default superAdminResolver;
