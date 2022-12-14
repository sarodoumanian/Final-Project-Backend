import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export default async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = null;
    return next();
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (decoded) {
    const user = await User.findOne({ where: { id: decoded.id }, attributes: ['id', 'role'] });
    req.user = user?.dataValues;
    next();
  } else {
    req.user = null;
    next();
  }
};
