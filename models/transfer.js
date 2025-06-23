import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true },
    transferCost: { type: Number, required: true },

    fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },

    transferDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const Transfer = mongoose.model('Transfer', transferSchema);
export default Transfer;
