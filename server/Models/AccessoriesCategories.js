import mongoose from 'mongoose';

const accessoriesCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('AccessoriesCategory', accessoriesCategorySchema);
