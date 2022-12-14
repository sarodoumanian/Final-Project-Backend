'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('users', [
      {
        firstName: 'super',
        lastName: 'admin',
        email: 'superadmin@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'superAdmin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'admin1',
        lastName: 'admin1',
        email: 'admin1@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'admin2',
        lastName: 'admin2',
        email: 'admin2@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'user2',
        lastName: 'user2',
        email: 'user2@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'user3',
        lastName: 'user3',
        email: 'user3@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'user4',
        lastName: 'user4',
        email: 'user4@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'user5',
        lastName: 'user5',
        email: 'user5@gmail.com',
        password: '$2b$08$KBmxMCtwcJA2xkzs49O5D.hJdzbjA.N9Affvvxihe3CW1eEJ5xv3u',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
