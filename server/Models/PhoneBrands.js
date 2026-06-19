import mongoose from 'mongoose';

const phoneBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  logo: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('PhoneBrand', phoneBrandSchema);
