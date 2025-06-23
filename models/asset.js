import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Logistic', 'Base'],
    required: true,
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  orderedDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Deployed', 'Maintenance', 'Retired'],
    default: 'Active',
  },
  budget: {
    type: Number,
    required: false,
    default: 0,
  },
  budgetHistory: [
    {
      amount: { type: Number, required: true },
      changedOn: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
