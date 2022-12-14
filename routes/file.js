import express from 'express';
import multer from 'multer';

import auth from '../middleware/auth.js';
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
      next(null, 'Post-' + req.user.id + '-' + file.originalname);
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
    const post = await Post.create({ title, catagory, image: req.file?.filename, userId: req.user.id });
    res.status(200).json(post);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

export default router;
