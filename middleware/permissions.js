import { shield, rule } from 'graphql-shield';

const isLoggedin = rule({ cache: 'contextual' })(async (_, __, { req }) => {
  if (req.user) return true;
  return 'Not Authorized';
});

const isSuperAdmin = rule({ cache: 'contextual' })(async (_, __, { req }) => {
  if (req.user?.role === 'superAdmin') return true;
  return 'not super admin';
});

const isAdmin = rule({ cache: 'contextual' })(async (_, __, { req }) => {
  if (req.user?.role === 'admin') return true;
  return 'not admin';
});

const permissions = shield({
  Query: {
    getAdmins: isSuperAdmin,
    getProfile: isLoggedin,
    getAllUsers: isAdmin,
    getUserById: isAdmin,
    logout: isLoggedin,
    getMyApprovedPosts: isLoggedin,
    getAllPosts: isLoggedin,
    getNewPosts: isAdmin,
    getMyRevertedPosts: isLoggedin
  },
  Mutation: {
    updateUserById: isAdmin,
    updateUser: isLoggedin,
    changePassword: isLoggedin,
    createAdmin: isSuperAdmin,
    approvePost: isAdmin,
    rejectPost: isAdmin,
    returnPost: isAdmin
  }
});

export default permissions;
