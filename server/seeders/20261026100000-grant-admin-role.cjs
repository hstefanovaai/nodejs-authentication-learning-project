"use strict";

// Grants the admin role to a single user. Looked up by email so the seed works
// regardless of the user's id. Must be a .cjs file: package.json has "type": "module".

const ADMIN_EMAIL = "xristiyana.stefanova@gmail.com";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate(
      "users",
      { role: "admin" },
      { email: ADMIN_EMAIL },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      "users",
      { role: "user" },
      { email: ADMIN_EMAIL },
    );
  },
};
