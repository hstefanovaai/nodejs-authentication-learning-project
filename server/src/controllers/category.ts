// Public (no auth):
//   GET    /api/categories            — browsing: sidebar menu, homepage
//   GET    /api/categories/:slug      — single category page with its products

// Admin only (authenticate + authorize):
//   POST   /api/categories            — create a new category
//   PUT    /api/categories/:id        — rename, re-parent, update description
//   DELETE /api/categories/:id        — remove an empty category

import { NextFunction, Request, Response } from "express";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categories = await Category.findAll({
    where: { parentId: null },
    include: [{ model: Category, as: "children", order: [["name", "ASC"]] }],
    order: [["name", "ASC"]],
  });

  res.json(categories);
};

export const getMainCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categories = await Category.findAll({
    where: { parentId: null },
  });
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.body;
  const category = await Category.findOne({
    where: { slug },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  res.json(category);
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, parentId } = req.body;

    if (parentId) {
      const parentCategory = await Category.findOne({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return res.status(400).json({ error: "Parent category not found" });
      }

      // Enforce two-level depth limit.
      // Why here and not in the model? Because this is a business rule,
      // not a data integrity constraint. The database doesn't know about
      // your navigation design. Putting it in the controller makes the
      // rule visible and the error message helpful.
      if (parentCategory.parentId !== null) {
        res.status(400).json({
          error: "Categories can only be nested one level deep",
        });
        return;
      }
    }

    const slug = slugify(name);
    const existingSlug = await Category.findOne({ where: { slug } });
    if (existingSlug) {
      return res.status(409).json({
        error: "A category with a similar name already exists (slug: ${slug})",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parentId,
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, parentId } = req.body;

    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    console.log("req params: ", req.params.id);

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    let slug = category.slug;
    if (name && name.trim() !== category.name) {
      slug = slugify(name);

      const existingSlug = await Category.findOne({ where: { slug } });
      if (existingSlug) {
        return res.status(409).json({ error: "Slug already exists" });
      }
    }

    // Validate new parent if re-parenting
    if (parentId) {
      if (parentId === category.id) {
        return res
          .status(400)
          .json({ error: "A category cannot be its own parent" });
      }

      // parent category to be its own parent not allowed
      const parent = await Category.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (parent.parentId !== null) {
        return res
          .status(400)
          .json({ error: "Categories can only be nested one level deep" });
      }

      // If this category has children and is being moved under a parent,
      // that would create a three-level tree. Block it.
      const children = await Category.findAll({
        where: {
          parentId: category.id,
        },
      });

      if (children.length) {
        return res.status(400).json({
          error:
            "Cannot nest a category that has subcategories — it would exceed two levels",
        });
      }
    }

    await category.update({
      name,
      slug,
      description,
      parentId,
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Check for child categories
    const children = await Category.count({ where: { parentId: category.id } });
    if (children > 0) {
      res.status(409).json({
        error:
          "Cannot delete a category that has subcategories. Move or delete them first.",
      });
      return;
    }

    // Once the Product model exists, uncomment this:
    // const productCount = await Product.count({ where: { categoryId: category.id } });
    // if (productCount > 0) {
    //   res.status(409).json({
    //     error: `Cannot delete: ${productCount} products are in this category. Move or deactivate them first.`,
    //   });
    //   return;
    // }

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
