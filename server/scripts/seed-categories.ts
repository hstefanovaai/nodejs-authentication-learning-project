// src/scripts/seed-categories.ts

import { sequelize } from "../src/config/database.js";
import Category from "../src/models/Category.js";
import { slugify } from "../src/utils/slugify.js";

const categoryTree: Record<
  string,
  { description: string; children: string[] }
> = {
  Fiction: {
    description: "Novels and short story collections across all genres",
    children: [
      "Literary Fiction",
      "Science Fiction",
      "Fantasy",
      "Mystery & Thriller",
      "Romance",
      "Historical Fiction",
    ],
  },
  "Non-Fiction": {
    description: "True stories, analysis, and explorations of the real world",
    children: [
      "Biography & Memoir",
      "Science & Nature",
      "History",
      "Business & Economics",
      "Self-Help",
    ],
  },
  "Children's Books": {
    description: "Stories and learning materials for young readers",
    children: ["Picture Books", "Middle Grade", "Young Adult"],
  },
  "Comics & Graphic Novels": {
    description: "Visual storytelling in all its forms",
    children: ["Manga", "Superhero Comics", "Indie & Literary Comics"],
  },
  "Academic & Reference": {
    description: "Textbooks, technical guides, and scholarly works",
    children: ["Textbooks", "Programming & Technology", "Philosophy"],
  },
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.\n");

    // Disable foreign key checks so we can clear the table even if
    // products already reference categories. Safe in development only.
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await Category.destroy({ where: {}, force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Cleared existing categories.\n");

    let totalCategories = 0;

    for (const [parentName, { description, children }] of Object.entries(
      categoryTree,
    )) {
      const parent = await Category.create({
        name: parentName,
        slug: slugify(parentName),
        description,
        parentId: null,
      });
      totalCategories++;

      for (const childName of children) {
        await Category.create({
          name: childName,
          slug: slugify(childName),
          description: null,
          parentId: parent.id,
        });
        totalCategories++;
      }

      const childList = children.join(", ");
      console.log(`  ${parentName}`);
      console.log(`    └── ${childList}\n`);
    }

    console.log(`Seeded ${totalCategories} categories.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
