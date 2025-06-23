import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  equipmentType: {
    type: String,
    required: true,
    trim: true, 
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base', 
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  costPerUnit: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Purchase', purchaseSchema);
