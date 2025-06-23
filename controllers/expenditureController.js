import Purchase from '../models/purchase.js';
import Base from '../models/base.js';
import mongoose from 'mongoose';

export const getExpenditures = async (req, res) => {
  try {
    const { role, baseId } = req.user;
    const matchStage = role === 'base' ? { baseId: new mongoose.Types.ObjectId(baseId) } : {};

    const expenditures = await Purchase.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$baseId',
          totalCost: { $sum: { $multiply: ['$costPerUnit', '$quantity'] } },
          equipmentTypes: { $addToSet: '$equipmentType' },
          latestPurchaseDate: { $max: '$purchaseDate' }
        }
      },
      {
        $lookup: {
          from: 'bases',
          localField: '_id',
          foreignField: '_id',
          as: 'baseInfo'
        }
      },
      { $unwind: '$baseInfo' },
      {
        $project: {
          baseId: '$_id',
          base_name: '$baseInfo.base_name',
          location: '$baseInfo.location',
          totalCost: 1,
          equipmentTypes: 1,
          latestPurchaseDate: 1
        }
      },
      { $sort: { totalCost: -1 } }
    ]);

    res.status(200).json({ success: true, expenditures });
  } catch (error) {
    console.error('Expenditure fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenditures', error });
  }
};
