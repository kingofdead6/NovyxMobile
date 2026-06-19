import asyncHandler from 'express-async-handler';
import PhoneBrand from '../Models/PhoneBrands.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getPhoneBrands = asyncHandler(async (req, res) => {
  const brands = await PhoneBrand.find({}).sort({ name: 1 }).lean();
  res.json(brands);
});

export const getActivePhoneBrands = asyncHandler(async (req, res) => {
  const brands = await PhoneBrand.find({ isActive: true }).sort({ name: 1 }).lean();
  res.json(brands);
});

export const createPhoneBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    res.status(400);
    throw new Error('Brand name is required');
  }

  const exists = await PhoneBrand.findOne({ name: name.trim() });
  if (exists) {
    res.status(400);
    throw new Error('This brand already exists');
  }

  let logo = { url: null, public_id: null };
  if (req.file) {
    const url = await uploadToCloudinary(req.file);
    logo = { url, public_id: null };
  }

  const brand = await PhoneBrand.create({ name: name.trim(), logo });
  res.status(201).json(brand);
});

export const updatePhoneBrand = asyncHandler(async (req, res) => {
  const brand = await PhoneBrand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const { name, isActive } = req.body;
  if (name) brand.name = name.trim();
  if (isActive !== undefined) brand.isActive = isActive === 'true' || isActive === true;

  if (req.file) {
    const url = await uploadToCloudinary(req.file);
    brand.logo = { url, public_id: null };
  }

  const updated = await brand.save();
  res.json(updated);
});

export const deletePhoneBrand = asyncHandler(async (req, res) => {
  const brand = await PhoneBrand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  await brand.deleteOne();
  res.json({ message: 'Brand deleted' });
});
