import asyncHandler from 'express-async-handler';
import Accessory from '../Models/Accessories.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getAccessories = asyncHandler(async (req, res) => {
  const { category, isActive, showOnProductsPage } = req.query;
  const query = {};
  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (showOnProductsPage !== undefined) query.showOnProductsPage = showOnProductsPage === 'true';

  const accessories = await Accessory.find(query)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
  res.json(accessories);
});

export const getAccessoryById = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id).populate('category', 'name').lean();
  if (!accessory) {
    res.status(404);
    throw new Error('Accessory not found');
  }
  res.json(accessory);
});

export const createAccessory = asyncHandler(async (req, res) => {
  const { name, category, price, stock, description, brand } = req.body;

  if (!name || !category || price === undefined) {
    res.status(400);
    throw new Error('Name, category and price are required');
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      images.push({ url, public_id: null });
    }
  }

  const accessory = await Accessory.create({
    name: name.trim(),
    category,
    price: Number(price),
    stock: stock !== undefined ? Number(stock) : 0,
    description: description?.trim() || '',
    brand: brand?.trim() || '',
    images,
  });

  res.status(201).json(accessory);
});

export const updateAccessory = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id);
  if (!accessory) {
    res.status(404);
    throw new Error('Accessory not found');
  }

  const { name, category, price, stock, description, brand, isActive, showOnProductsPage } = req.body;
  if (name) accessory.name = name.trim();
  if (category) accessory.category = category;
  if (price !== undefined) accessory.price = Number(price);
  if (stock !== undefined) accessory.stock = Number(stock);
  if (description !== undefined) accessory.description = description.trim();
  if (brand !== undefined) accessory.brand = brand.trim();
  if (isActive !== undefined) accessory.isActive = isActive === 'true' || isActive === true;
  if (showOnProductsPage !== undefined)
    accessory.showOnProductsPage = showOnProductsPage === 'true' || showOnProductsPage === true;

  if (req.files && req.files.length > 0) {
    const newImages = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      newImages.push({ url, public_id: null });
    }
    accessory.images = [...accessory.images, ...newImages];
  }

  const updated = await accessory.save();
  res.json(updated);
});

export const deleteAccessory = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id);
  if (!accessory) {
    res.status(404);
    throw new Error('Accessory not found');
  }

  await accessory.deleteOne();
  res.json({ message: 'Accessory deleted' });
});

export const toggleAccessoryActive = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id);
  if (!accessory) {
    res.status(404);
    throw new Error('Accessory not found');
  }
  accessory.isActive = !accessory.isActive;
  await accessory.save();
  res.json(accessory);
});
