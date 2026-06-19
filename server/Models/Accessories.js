import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccessoriesCategory',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: { type: Number, default: null, min: 0 },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, default: null },
    },
  ],
  description: {
    type: String,
    trim: true,
    default: '',
  },
  brand: {
    type: String,
    trim: true,
    default: '',
  },
  isActive: { type: Boolean, default: true },
  showOnProductsPage: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Accessory', accessorySchema);
