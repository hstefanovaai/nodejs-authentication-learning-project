'use strict';

// Column names are snake_case because the User model uses `underscored: true`
// (resetToken -> reset_token, resetTokenExpiration -> reset_token_expiration).
// Must be a .cjs file: package.json has "type": "module" and umzug loads
// migrations with require().

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'reset_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'reset_token_expiration', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'reset_token_expiration');
    await queryInterface.removeColumn('users', 'reset_token');
  },
};
