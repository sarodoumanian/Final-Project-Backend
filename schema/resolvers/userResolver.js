import { ApolloError } from 'apollo-server-express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';
const userResolver = {
  Query: {
    async getProfile(_, __, { req }) {
      const user = await User.findOne({ where: { id: req.user.id }, attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'] });
      return user;
    },
    logout(_, __, { ___, res }) {
      res.clearCookie('token').clearCookie('id');
      return {
        __typename: 'Response',
        message: 'logged out'
      };
    }
  },
  Mutation: {
    async register(_, { firstName, lastName, email, password }) {
      try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return {
            __typename: 'Error',
            message: 'Email already taken'
          };
        }
        const hashed = await bcrypt.hash(password, 8);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashed,
          role: 'user'
        });
        return {
          __typename: 'User',
          ...user.dataValues
        };
      } catch (err) {
        console.log(err);
        throw new ApolloError(err.message);
      }
    },
    async login(_, { email, password }, { __, res }) {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return {
            __typename: 'Error',
            message: 'email or password is incorrect'
          };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            __typename: 'Error',
            message: 'email or password is incorrect'
          };
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '5h' });
        delete user.dataValues.password;
        // req.user = user.dataValues;
        res.cookie('token', token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true }).cookie('id', user.id, { maxAge: 5 * 60 * 60 * 1000 });
        return {
          __typename: 'User',
          ...user.dataValues
        };
      } catch (err) {
        throw new Error(err.message, 401);
      }
    },
    async updateUser(_, args, { req }) {
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
        await User.update(obj, { where: { id: req.user.id } });
        return {
          __typename: 'Response',
          message: 'User updated successfully'
        };
      } catch (error) {
        console.log(error);
      }
    },
    async changePassword(_, { oldPassword, newPassword, confirmPassword }, { req }) {
      try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return {
            __typename: 'Error',
            message: 'old password is incorrect'
          };
        }
        if (newPassword !== confirmPassword) {
          return {
            __typename: 'Error',
            message: 'new password and confirm password do not match'
          };
        }
        const hashed = await bcrypt.hash(newPassword, 8);
        await User.update({ password: hashed }, { where: { id: req.user.id } });
        return {
          __typename: 'Response',
          message: 'password changed'
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export default userResolver;
