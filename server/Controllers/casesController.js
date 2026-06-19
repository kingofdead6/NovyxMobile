import asyncHandler from 'express-async-handler';
import Case from '../Models/Cases.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getCases = asyncHandler(async (req, res) => {
  const { brand, isActive } = req.query;
  const query = {};
  if (brand) query.brand = brand;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const cases = await Case.find(query).populate('brand', 'name logo').sort({ createdAt: -1 }).lean();
  res.json(cases);
});

export const getCaseById = asyncHandler(async (req, res) => {
  const item = await Case.findById(req.params.id).populate('brand', 'name logo').lean();
  if (!item) {
    res.status(404);
    throw new Error('Case not found');
  }
  res.json(item);
});

export const createCase = asyncHandler(async (req, res) => {
  const { name, brand, compatibleModels, material, color, price, salePrice, stock, description } = req.body;

  if (!name || !brand || price === undefined) {
    res.status(400);
    throw new Error('Name, brand and price are required');
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      images.push({ url, public_id: null });
    }
  }

  const item = await Case.create({
    name: name.trim(),
    brand,
    compatibleModels: compatibleModels
      ? (Array.isArray(compatibleModels) ? compatibleModels : JSON.parse(compatibleModels))
      : [],
    material: material?.trim() || '',
    color: color?.trim() || '',
    price: Number(price),
    salePrice: salePrice !== undefined && salePrice !== '' ? Number(salePrice) : null,
    stock: stock !== undefined ? Number(stock) : 0,
    description: description?.trim() || '',
    images,
  });

  res.status(201).json(item);
});

export const updateCase = asyncHandler(async (req, res) => {
  const item = await Case.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Case not found');
  }

  const { name, brand, compatibleModels, material, color, price, salePrice, stock, description, isActive } = req.body;
  if (name) item.name = name.trim();
  if (brand) item.brand = brand;
  if (compatibleModels !== undefined)
    item.compatibleModels = Array.isArray(compatibleModels) ? compatibleModels : JSON.parse(compatibleModels);
  if (material !== undefined) item.material = material.trim();
  if (color !== undefined) item.color = color.trim();
  if (price !== undefined) item.price = Number(price);
  if (salePrice !== undefined) item.salePrice = salePrice !== '' && salePrice !== null ? Number(salePrice) : null;
  if (stock !== undefined) item.stock = Number(stock);
  if (description !== undefined) item.description = description.trim();
  if (isActive !== undefined) item.isActive = isActive === 'true' || isActive === true;

  if (req.files && req.files.length > 0) {
    const newImages = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      newImages.push({ url, public_id: null });
    }
    item.images = [...item.images, ...newImages];
  }

  const updated = await item.save();
  res.json(updated);
});

export const deleteCase = asyncHandler(async (req, res) => {
  const item = await Case.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Case not found');
  }

  await item.deleteOne();
  res.json({ message: 'Case deleted' });
});

export const toggleCaseActive = asyncHandler(async (req, res) => {
  const item = await Case.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Case not found');
  }
  item.isActive = !item.isActive;
  await item.save();
  res.json(item);
});
