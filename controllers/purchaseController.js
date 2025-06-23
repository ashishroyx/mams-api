import Purchase from '../models/purchase.js';

// ✅ Create a new purchase
export const addPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const saved = await newPurchase.save();
    res.status(201).json({ success: true, purchase: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add purchase', error });
  }
};

// ✅ Get all purchases with optional filters
export const getAllPurchases = async (req, res) => {
  try {
    const { startDate, endDate, equipmentType, baseId } = req.query;

    const filter = {};

    // 🗓️ Date Range Filter
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      filter.purchaseDate = dateFilter;
    }

    // 🎯 Equipment Type Filter
    if (equipmentType && equipmentType !== 'All') {
      filter.equipmentType = equipmentType;
    }

    // 🛡️ Base ID Filter
    if (baseId && baseId !== 'All') {
      filter.baseId = baseId;
    }

    const purchases = await Purchase.find(filter).populate('baseId', 'base_name location');

    res.status(200).json({ success: true, purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch purchases', error });
  }
};
