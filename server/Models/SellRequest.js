import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  
  itemName: { type: String, required: true, trim: true },        // What they want to sell
  description: { type: String, required: true, trim: true },
  proposedPrice: { type: Number, required: true, min: 0 },
  
  images: [
    {
      url: { type: String, required: true },
    }
  ],

  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('SellRequest', sellRequestSchema);