import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import { errorHandler } from './Middleware/error.js';

import authRoutes from './Routes/authRoutes.js';
import phonesRoutes from './Routes/phonesRoutes.js';
import categoryRoutes from './Routes/categoriesRoutes.js';
import phoneBrandsRoutes from './Routes/phoneBrandsRoutes.js';
import accessoriesCategoriesRoutes from './Routes/accessoriesCategoriesRoutes.js';
import accessoriesRoutes from './Routes/accessoriesRoutes.js';
import casesRoutes from './Routes/casesRoutes.js';
import deliveryAreaRoutes from './Routes/deliveryAreaRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import sellRequestRoutes from './Routes/sellRequestRoutes.js';
import repairRequestRoutes from './Routes/repairRequestRoutes.js';
import contactRoutes from './Routes/contactRoutes.js';
import galleryRoutes from './Routes/galleryRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/phones', phonesRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/phone-brands', phoneBrandsRoutes);
app.use('/api/accessories-categories', accessoriesCategoriesRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/delivery-areas', deliveryAreaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sell-requests', sellRequestRoutes);
app.use('/api/repair-requests', repairRequestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
