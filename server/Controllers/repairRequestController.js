import asyncHandler from 'express-async-handler';
import RepairRequest from '../Models/RepairRequest.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Create new repair request
export const createRepairRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, itemName, issueDescription, preferredDate } = req.body;

  if (!name || !email || !phone || !itemName || !issueDescription) {
    res.status(400);
    throw new Error('Tous les champs obligatoires doivent être remplis');
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      images.push({ url });
    }
  }

  const request = await RepairRequest.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    itemName: itemName.trim(),
    issueDescription: issueDescription.trim(),
    preferredDate: preferredDate || null,
    images,
  });

  res.status(201).json({
    success: true,
    message: "Demande de réparation envoyée avec succès ! Nous vous contacterons bientôt.",
    requestId: request._id
  });
});

// Get all repair requests (Admin)
export const getAllRepairRequests = asyncHandler(async (req, res) => {
  const requests = await RepairRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

// Delete repair request (Admin)
export const deleteRepairRequest = asyncHandler(async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  
  if (!request) {
    res.status(404);
    throw new Error('Demande de réparation non trouvée');
  }

  await RepairRequest.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Demande supprimée avec succès' });
});