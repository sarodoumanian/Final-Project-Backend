import { DataTypes } from 'sequelize';

import Db from '../db/db.js';

import Post from './post.js';
import User from './user.js';

const Comment = Db.define('comment', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    hooks: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    },
    onDelete: 'CASCADE',
    hooks: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
});

Comment.belongsTo(User);
// Comment.belongsTo(Post);
Post.hasMany(Comment);

export default Comment;
