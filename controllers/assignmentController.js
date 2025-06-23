import Assignment from '../models/assignment.js';
import Base from '../models/base.js';


export const createAssignment = async (req, res) => {
  try {
    const { itemName, equipmentType, quantity, assignedTo, baseId } = req.body;

    const assignment = new Assignment({
      itemName,
      equipmentType,
      quantity,
      assignedTo,
      baseId,
      assignedBy: req.user._id,
    });

    const saved = await assignment.save();
    res.status(201).json({ success: true, assignment: saved });
  } catch (error) {
    console.error('Assignment creation failed:', error);
    res.status(500).json({ success: false, message: 'Failed to assign item', error });
  }
};


export const getAssignments = async (req, res) => {
  try {
    const { role, baseId } = req.user;

    const query = role === 'base' ? { baseId } : {};

    const assignments = await Assignment.find(query)
      .populate('baseId', 'base_name location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    res.status(500).json({ success: false, message: 'Fetch failed', error });
  }
};
