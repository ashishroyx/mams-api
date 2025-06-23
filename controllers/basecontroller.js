

import Base from '../models/base.js';


export const createBase = async (req, res) => {
  try {
    const { base_name, location, commander_name, description } = req.body;

    if (!base_name || !location || !commander_name || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBase = new Base({ base_name, location, commander_name, description });
    await newBase.save();

    res.status(201).json({ message: 'Base created successfully', base: newBase });
  } catch (error) {
    console.error('Error creating base:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllBases = async (req, res) => {
  try {
    const bases = await Base.find().sort({ createdAt: -1 });
    res.status(200).json(bases);
  } catch (error) {
    console.error('Error fetching bases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getBaseById = async (req, res) => {
  try {
    const base = await Base.findById(req.params.id);
    if (!base) {
      return res.status(404).json({ message: 'Base not found' });
    }
    res.status(200).json(base);
  } catch (error) {
    console.error('Error fetching base:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateBase = async (req, res) => {
  try {
    const { base_name, location, commander_name, description } = req.body;

    const updatedBase = await Base.findByIdAndUpdate(
      req.params.id,
      { base_name, location, commander_name, description },
      { new: true, runValidators: true }
    );

    if (!updatedBase) {
      return res.status(404).json({ message: 'Base not found' });
    }

    res.status(200).json({ message: 'Base updated successfully', base: updatedBase });
  } catch (error) {
    console.error('Error updating base:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteBase = async (req, res) => {
  try {
    const deletedBase = await Base.findByIdAndDelete(req.params.id);
    if (!deletedBase) {
      return res.status(404).json({ message: 'Base not found' });
    }
    res.status(200).json({ message: 'Base deleted successfully' });
  } catch (error) {
    console.error('Error deleting base:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
