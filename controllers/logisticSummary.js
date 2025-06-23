import Purchase from '../models/purchase.js';
import Transfer from '../models/transfer.js';
import Base from '../models/base.js';
import mongoose from 'mongoose';

export const getLogisticsSummary = async (req, res) => {
  try {
    const { role, baseId } = req.user;
    const matchBase = role === 'base' ? new mongoose.Types.ObjectId(baseId) : null;

    const baseFilter = matchBase ? { _id: matchBase } : {};

    // STEP 1: Fetch all bases
    const bases = await Base.find(baseFilter, '_id base_name location');

    // STEP 2: Fetch Expenditures
    const purchases = await Purchase.aggregate([
      { $match: matchBase ? { baseId: matchBase } : {} },
      {
        $group: {
          _id: '$baseId',
          totalExpenditure: { $sum: { $multiply: ['$costPerUnit', '$quantity'] } },
          latestPurchase: { $max: '$purchaseDate' }
        }
      }
    ]);

    const expenditureMap = {};
    purchases.forEach(p => {
      expenditureMap[p._id.toString()] = {
        totalExpenditure: p.totalExpenditure,
        latestPurchase: p.latestPurchase,
      };
    });

    // STEP 3: Inventory Calculations
    const purchasesQty = await Purchase.aggregate([
      { $match: matchBase ? { baseId: matchBase } : {} },
      {
        $group: {
          _id: { baseId: '$baseId', itemName: '$itemName', equipmentType: '$equipmentType' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    const transfersIn = await Transfer.aggregate([
      { $match: matchBase ? { toBase: matchBase } : {} },
      {
        $group: {
          _id: { baseId: '$toBase', itemName: '$itemName', equipmentType: '$equipmentType' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    const transfersOut = await Transfer.aggregate([
      { $match: matchBase ? { fromBase: matchBase } : {} },
      {
        $group: {
          _id: { baseId: '$fromBase', itemName: '$itemName', equipmentType: '$equipmentType' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Combine inventory
    const inventoryMap = new Map();
    const mergeInventory = (arr, modifier = 1) => {
      arr.forEach(({ _id, quantity }) => {
        const key = `${_id.baseId}-${_id.itemName}-${_id.equipmentType}`;
        const existing = inventoryMap.get(key) || { ..._id, quantity: 0 };
        existing.quantity += quantity * modifier;
        inventoryMap.set(key, existing);
      });
    };

    mergeInventory(purchasesQty, 1);
    mergeInventory(transfersIn, 1);
    mergeInventory(transfersOut, -1);

    // Format inventory
    const inventoryByBase = {};
    inventoryMap.forEach(({ baseId, itemName, equipmentType, quantity }) => {
      if (quantity <= 0) return;
      const baseKey = baseId.toString();
      if (!inventoryByBase[baseKey]) inventoryByBase[baseKey] = [];
      inventoryByBase[baseKey].push({ itemName, equipmentType, quantity });
    });

    // STEP 4: Transfer Summary
    const transfers = await Transfer.find(matchBase ? {
      $or: [{ fromBase: matchBase }, { toBase: matchBase }]
    } : {}).populate('fromBase toBase', 'base_name');

    const transferSummary = {};
    transfers.forEach(t => {
      const from = t.fromBase?._id?.toString();
      const to = t.toBase?._id?.toString();

      if (from) {
        transferSummary[from] = transferSummary[from] || { in: 0, out: 0 };
        transferSummary[from].out += t.quantity;
      }

      if (to) {
        transferSummary[to] = transferSummary[to] || { in: 0, out: 0 };
        transferSummary[to].in += t.quantity;
      }
    });

    // STEP 5: Combine All Per Base
    const summary = bases.map(base => {
      const id = base._id.toString();
      return {
        baseId: id,
        baseName: base.base_name,
        location: base.location,
        totalExpenditure: expenditureMap[id]?.totalExpenditure || 0,
        latestPurchase: expenditureMap[id]?.latestPurchase || null,
        inventory: inventoryByBase[id] || [],
        transfers: transferSummary[id] || { in: 0, out: 0 }
      };
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('Logistics summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch summary', error });
  }
};
