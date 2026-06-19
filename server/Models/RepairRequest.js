import mongoose from 'mongoose';

const repairRequestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true, 
    trim: true 
  },
  itemName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  issueDescription: { 
    type: String, 
    required: true 
  },
  preferredDate: { 
    type: Date 
  },

  images: [
    {
      url: { type: String, required: true },
    }
  ],

  status: {
    type: String,
    enum: ['pending', 'reviewed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('RepairRequest', repairRequestSchema);