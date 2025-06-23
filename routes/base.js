import express from 'express';
import Base from '../models/base.js';

const router = express.Router();


router.post('/add', async (req, res) => {
  try {
    const { base_name, location, commander_name, description } = req.body;

    if (!base_name || !location || !commander_name || !description) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newBase = new Base({ base_name, location, commander_name, description });
    await newBase.save();

    res.status(201).json({ success: true, message: 'Base added successfully', base: newBase });
  } catch (error) {
    console.error('Error adding base:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


router.get('/all', async (req, res) => {
  try {
    const bases = await Base.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bases });
  } catch (error) {
    console.error('Error fetching bases:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const base = await Base.findById(req.params.id);
    if (!base) return res.status(404).json({ success: false, error: 'Base not found' });

    res.status(200).json(base); 
  } catch (error) {
    console.error('Error fetching base:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { base_name, location, commander_name, description } = req.body;

    const updatedBase = await Base.findByIdAndUpdate(
      req.params.id,
      { base_name, location, commander_name, description },
      { new: true }
    );

    if (!updatedBase) return res.status(404).json({ success: false, error: 'Base not found' });

    res.status(200).json({ success: true, message: 'Base updated successfully', base: updatedBase });
  } catch (error) {
    console.error('Error updating base:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
