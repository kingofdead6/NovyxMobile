import mongoose from 'mongoose';

const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneBrand',
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, default: null, min: 0 },
  storage: { type: String, trim: true },
  ram: { type: String, trim: true },
  color: { type: String, trim: true },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new',
  },
  stock: { type: Number, default: 0, min: 0 },
  description: { type: String, trim: true, default: '' },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, default: null },
    },
  ],
  isActive: { type: Boolean, default: true },
  showOnProductsPage: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Phone', phoneSchema);
