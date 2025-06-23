import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Base',
      required: true,
    },
    assignedTo: { type: String, required: true }, 
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    assignmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
