import asyncHandler from 'express-async-handler';
import SellRequest from '../Models/SellRequest.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get all requests (Admin)
export const getAllSellRequests = asyncHandler(async (req, res) => {
  const requests = await SellRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

// Create new sell request
export const createSellRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, itemName, description, proposedPrice } = req.body;

  if (!name || !email || !phone || !itemName || !description || !proposedPrice) {
    res.status(400);
    throw new Error('Tous les champs sont obligatoires');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Veuillez uploader au moins une image');
  }

  const images = [];
  for (const file of req.files) {
    const url = await uploadToCloudinary(file);
    images.push({ url });
  }

  const request = await SellRequest.create({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    itemName: itemName.trim(),
    description: description.trim(),
    proposedPrice: Number(proposedPrice),
    images,
  });

  res.status(201).json({
    success: true,
    message: "Votre proposition a été envoyée avec succès. Nous vous contacterons bientôt !",
    requestId: request._id
  });
});

// Delete request (Admin)
export const deleteSellRequest = asyncHandler(async (req, res) => {
  const request = await SellRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Proposition non trouvée');
  }
  await SellRequest.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Proposition supprimée' });
});