import asyncHandler from 'express-async-handler';
import Phone from '../Models/Phone.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getPhones = asyncHandler(async (req, res) => {
  const { brand, condition, isActive, showOnProductsPage } = req.query;
  const query = {};
  if (brand) query.brand = brand;
  if (condition) query.condition = condition;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (showOnProductsPage !== undefined) query.showOnProductsPage = showOnProductsPage === 'true';

  const phones = await Phone.find(query)
    .populate('brand', 'name logo')
    .sort({ createdAt: -1 })
    .lean();
  res.json(phones);
});

export const getFeaturedPhones = asyncHandler(async (req, res) => {
  const { brand } = req.query;
  const query = { showOnProductsPage: true, isActive: true };
  if (brand) query.brand = brand;

  const phones = await Phone.find(query)
    .populate('brand', 'name logo')
    .sort({ createdAt: -1 })
    .lean();
  res.json(phones);
});

export const getPhoneById = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id).populate('brand', 'name logo').lean();
  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }
  res.json(phone);
});

export const createPhone = asyncHandler(async (req, res) => {
  const { name, brand, price, salePrice, storage, ram, color, condition, stock, description } = req.body;

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

  const phone = await Phone.create({
    name: name.trim(),
    brand,
    price: Number(price),
    salePrice: salePrice !== undefined && salePrice !== '' ? Number(salePrice) : null,
    storage: storage?.trim() || '',
    ram: ram?.trim() || '',
    color: color?.trim() || '',
    condition: condition || 'new',
    stock: stock !== undefined ? Number(stock) : 0,
    description: description?.trim() || '',
    images,
  });

  res.status(201).json(phone);
});

export const updatePhone = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);
  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }

  const { name, brand, price, salePrice, storage, ram, color, condition, stock, description, isActive, showOnProductsPage } = req.body;
  if (name) phone.name = name.trim();
  if (brand) phone.brand = brand;
  if (price !== undefined) phone.price = Number(price);
  if (salePrice !== undefined) phone.salePrice = salePrice !== '' && salePrice !== null ? Number(salePrice) : null;
  if (storage !== undefined) phone.storage = storage.trim();
  if (ram !== undefined) phone.ram = ram.trim();
  if (color !== undefined) phone.color = color.trim();
  if (condition) phone.condition = condition;
  if (stock !== undefined) phone.stock = Number(stock);
  if (description !== undefined) phone.description = description.trim();
  if (isActive !== undefined) phone.isActive = isActive === 'true' || isActive === true;
  if (showOnProductsPage !== undefined)
    phone.showOnProductsPage = showOnProductsPage === 'true' || showOnProductsPage === true;

  if (req.files && req.files.length > 0) {
    const newImages = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      newImages.push({ url, public_id: null });
    }
    phone.images = [...phone.images, ...newImages];
  }

  const updated = await phone.save();
  res.json(updated);
});

export const deletePhone = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);
  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }
  await phone.deleteOne();
  res.json({ message: 'Phone deleted' });
});

export const togglePhoneActive = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);
  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }
  phone.showOnProductsPage = !phone.showOnProductsPage;
  await phone.save();
  res.json(phone);
});
