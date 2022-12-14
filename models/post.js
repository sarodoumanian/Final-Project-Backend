import { DataTypes } from 'sequelize';

import Db from '../db/db.js';

import User from './user.js';

const Post = Db.define(
  'post',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    catagory: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    },

    status: {
      type: DataTypes.ENUM('pending', 'approved', 'reverted'),
      defaultValue: 'pending'
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    paranoid: true
  }
);

Post.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Post.belongsTo(User, { foreignKey: 'approvedBy', as: 'approve' });

export default Post;
