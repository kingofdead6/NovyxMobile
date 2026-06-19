import asyncHandler from "express-async-handler";
import Categories from "../Models/Categories.js";
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim().length === 0) {
    res.status(400);
    throw new Error("Le nom de la catégorie est requis");
  }

  const categoryExists = await Categories.findOne({ name: name.trim() });
  if (categoryExists) {
    res.status(400);
    throw new Error("Cette catégorie existe déjà");
  }

  let imageData = null;


if (req.file) {
    try {
      console.log("Starting Cloudinary upload for file:", req.file.originalname);

      const uploadedUrl = await uploadToCloudinary(req.file);  

      if (uploadedUrl) {
        imageData = {
          url: uploadedUrl,          
          public_id: null             
        };
        console.log("✅ Image successfully uploaded to Cloudinary:", imageData.url);
      }
    } catch (uploadError) {
      console.error("❌ Cloudinary upload failed:", uploadError.message);
      imageData = null;
    }
  }

  // Create category
  const category = await Categories.create({
    name: name.trim(),
    description: description ? description.trim() : "",
    image: imageData
  });

  console.log("Category created with image:", category.image ? category.image.url : "No image");

  res.status(201).json(category);
});





// Get All Categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find({}).sort({ name: 1 });
  res.status(200).json(categories);
});

// Delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Categories.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Optional: Delete image from Cloudinary if you want
  // if (category.image?.public_id) {
  //   await deleteFromCloudinary(category.image.public_id);
  // }

  await Categories.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Category removed successfully" });
});