"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        // Why SET NULL and not CASCADE on delete?
        // If you delete "Footwear", you probably don't want to
        // automatically delete "Hiking Boots" and "Trail Runners"
        // and every product in them. SET NULL turns children into
        // top-level categories, which an admin can then reassign.
        // CASCADE would silently wipe out an entire subtree.
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("categories", ["parentId"], {
      name: "idx_categories_parent_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("categories");
  },
};
