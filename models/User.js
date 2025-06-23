import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "logistic", "base"], required: true },
  profileimg: { type: String },

  // ✅ New field to link base users to their base
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: function () {
      return this.role === 'base'; // Required only for base users
    }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
