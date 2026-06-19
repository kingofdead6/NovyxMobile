import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneBrand',
    required: true,
  },
  compatibleModels: [{ type: String, trim: true }],
  material: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
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
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);
