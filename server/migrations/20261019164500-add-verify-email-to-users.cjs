"use strict";

// Column names are snake_case because the User model uses `underscored: true`
// (resetToken -> reset_token, resetTokenExpiration -> reset_token_expiration).
// Must be a .cjs file: package.json has "type": "module" and umzug loads
// migrations with require().

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "is_email_verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    await queryInterface.addColumn("users", "email_verification_token_hash", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn("users", "email_verification_expires", {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.sequelize.query('UPDATE users SET is_email_verified = true');
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "is_email_verified");
    await queryInterface.removeColumn("users", "email_verification_token_hash");
    await queryInterface.removeColumn("users", "email_verification_expires");
  },
};
