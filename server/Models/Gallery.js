import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    default: null,
  },
  caption: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
