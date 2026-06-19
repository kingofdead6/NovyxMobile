import asyncHandler from 'express-async-handler';
import AccessoriesCategory from '../Models/AccessoriesCategories.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getAccessoriesCategories = asyncHandler(async (req, res) => {
  const categories = await AccessoriesCategory.find({}).sort({ name: 1 }).lean();
  res.json(categories);
});

export const getActiveAccessoriesCategories = asyncHandler(async (req, res) => {
  const categories = await AccessoriesCategory.find({ isActive: true }).sort({ name: 1 }).lean();
  res.json(categories);
});

export const createAccessoriesCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim().length === 0) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const exists = await AccessoriesCategory.findOne({ name: name.trim() });
  if (exists) {
    res.status(400);
    throw new Error('This category already exists');
  }

  let image = { url: null, public_id: null };
  if (req.file) {
    const url = await uploadToCloudinary(req.file);
    image = { url, public_id: null };
  }

  const category = await AccessoriesCategory.create({
    name: name.trim(),
    description: description ? description.trim() : '',
    image,
  });

  res.status(201).json(category);
});

export const updateAccessoriesCategory = asyncHandler(async (req, res) => {
  const category = await AccessoriesCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, description, isActive } = req.body;
  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  if (isActive !== undefined) category.isActive = isActive === 'true' || isActive === true;

  if (req.file) {
    const url = await uploadToCloudinary(req.file);
    category.image = { url, public_id: null };
  }

  const updated = await category.save();
  res.json(updated);
});

export const deleteAccessoriesCategory = asyncHandler(async (req, res) => {
  const category = await AccessoriesCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
});
