import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Populate baseId only for base users
    const user = await User.findOne({ email }).populate('baseId');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '30d' }
    );

    const responseUser = {
      _id: user._id,
      name: user.name,
      role: user.role,
      ...(user.role === 'base' && { baseId: user.baseId }), // baseId only if role is base
    };

    return res.status(200).json({ success: true, token, user: responseUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify };