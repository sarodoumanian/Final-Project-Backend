// import { ApolloError } from 'apollo-server-express';

import Comment from '../../models/comment.js';
import Like from '../../models/like.js';
import Post from '../../models/post.js';
import User from '../../models/user.js';

const userResolver = {
  Query: {
    async getMyApprovedPosts(_, __, { req }) {
      const posts = await Post.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'title', 'catagory', 'image', 'createdAt'],
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'owner', attributes: ['firstName', 'lastName'] },
          { model: Comment, required: false, attributes: ['id', 'text', 'userId', 'postId', 'createdAt'], include: { model: User, attributes: ['firstName', 'lastName', 'profilePic'] } },
          { model: Like, required: false, include: { model: User, attributes: ['firstName', 'lastName'] } }
        ]
      });
      return posts;
    },
    async getAllPosts() {
      try {
        const posts = await Post.findAll({
          where: { status: 'approved' },
          attributes: ['id', 'title', 'catagory', 'image', 'createdAt'],
          order: [['createdAt', 'DESC']],
          include: [
            { model: User, as: 'owner', attributes: ['firstName', 'lastName'] },
            { model: Comment, required: false, attributes: ['id', 'text', 'userId', 'postId', 'createdAt'], include: { model: User, attributes: ['firstName', 'lastName', 'profilePic'] } },
            { model: Like, required: false, include: { model: User, attributes: ['firstName', 'lastName'] } }
          ]
        });
        // console.log(posts);
        return posts;
      } catch (error) {
        console.log(error);
      }
    },
    async getNewPosts() {
      try {
        const posts = await Post.findAll({
          where: { status: 'pending' },
          attributes: ['id', 'title', 'catagory', 'image', 'createdAt'],
          order: [['createdAt', 'DESC']],
          include: { model: User, as: 'owner', attributes: ['firstName', 'lastName'] }
        });
        return posts;
      } catch (error) {
        console.log(error);
      }
    },
    async getMyRevertedPosts(_, __, { req }) {
      try {
        const posts = await Post.findAll({ where: { status: 'reverted', userId: req.user.id }, order: [['createdAt', 'DESC']] });
        return posts;
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    async approvePost(_, { id }, { req }) {
      try {
        await Post.update({ status: 'approved', approvedBy: req.user.id }, { where: { id } });
        return {
          message: 'Post Approved!'
        };
      } catch (error) {
        console.log(error);
      }
    },
    async rejectPost(_, { id }, { req }) {
      try {
        await Post.destroy({ where: { id } });
        return {
          message: 'Post Rejected!'
        };
      } catch (error) {
        console.log(error);
      }
    },
    async returnPost(_, { id }, { req }) {
      try {
        await Post.update({ status: 'reverted' }, { where: { id } });
        return {
          message: 'Post Returned!'
        };
      } catch (error) {
        console.log(error);
      }
    },
    async comment(_, { id, text }, { req }) {
      try {
        await Comment.create({
          userId: req.user.id,
          postId: id,
          text
        });
        return {
          message: 'comment created'
        };
      } catch (error) {
        console.log(error);
      }
    },
    async like(_, { id }, { req }) {
      try {
        await Like.create({ postId: id, userId: req.user.id });
        return {
          message: 'liked'
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export default userResolver;
