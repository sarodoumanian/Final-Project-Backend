import express from 'express';
import multer from 'multer';

import auth from '../middleware/auth.js';
import Comment from '../models/comment.js';
import Like from '../models/like.js';
import Post from '../models/post.js';
import User from '../models/user.js';
const router = express.Router();

const multerConfigProfilePic = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, 'public/profilePictures/');
    },

    filename: (req, file, next) => {
      console.log(file);
      next(null, 'Profile-' + req.user.id + '-' + file.originalname);
    }
  }),

  fileFilter: (req, file, next) => {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      return next();
    }
  }
};

const multerConfigPost = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, 'public/posts/');
    },

    filename: (req, file, next) => {
      const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      next(null, 'Post-' + random + '-' + file.originalname);
    }
  }),

  fileFilter: (req, file, next) => {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      return next();
    }
  }
};

router.post('/profile-picture', auth, multer(multerConfigProfilePic).single('image'), async (req, res) => {
  try {
    await User.update({ profilePic: req.file?.filename }, { where: { id: req.user.id } });
    res.json({ msg: 'ok' });
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

router.post('/post', auth, multer(multerConfigPost).single('image'), async (req, res) => {
  const { title, catagory } = req.body;
  try {
    const newPost = await Post.create({ title, catagory, image: req.file?.filename, userId: req.user.id });
    console.log(newPost);
    const post = await Post.findOne({
      where: { id: newPost.id },
      attributes: ['id', 'title', 'catagory', 'status', 'image', 'createdAt'],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [
        { model: User, as: 'owner', attributes: ['firstName', 'lastName', 'profilePic'] },
        { model: Comment, required: false, attributes: ['id', 'text', 'userId', 'postId', 'createdAt'], include: { model: User, attributes: ['firstName', 'lastName', 'profilePic'] } },
        { model: Like, required: false, include: { model: User, attributes: ['firstName', 'lastName'] } }
      ]
    });

    res.status(200).json(post);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

router.get('/getProfile', auth, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id }, attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePic', 'createdAt'] });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

export default router;
