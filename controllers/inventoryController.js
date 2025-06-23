import Purchase from '../models/purchase.js';
import Transfer from '../models/transfer.js';
import Base from '../models/base.js';
import mongoose from 'mongoose';

export const getInventory = async (req, res) => {
  try {
    const { role, baseId } = req.user;
    const matchBase = role === 'base' ? baseId : null;


    const bases = await Base.find({}, '_id base_name location');

 
    const purchases = await Purchase.aggregate([
      { $match: matchBase ? { baseId: new mongoose.Types.ObjectId(matchBase) } : {} },
      {
        $group: {
          _id: { baseId: '$baseId', equipmentType: '$equipmentType', itemName: '$itemName' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    
    const transfersIn = await Transfer.aggregate([
      { $match: matchBase ? { toBase: new mongoose.Types.ObjectId(matchBase) } : {} },
      {
        $group: {
          _id: { baseId: '$toBase', equipmentType: '$equipmentType', itemName: '$itemName' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

  
    const transfersOut = await Transfer.aggregate([
      { $match: matchBase ? { fromBase: new mongoose.Types.ObjectId(matchBase) } : {} },
      {
        $group: {
          _id: { baseId: '$fromBase', equipmentType: '$equipmentType', itemName: '$itemName' },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    
    const inventoryMap = new Map();

    const addToMap = (arr, modifier = 1) => {
      arr.forEach(({ _id, quantity }) => {
        const key = `${_id.baseId}-${_id.equipmentType}-${_id.itemName}`;
        const prev = inventoryMap.get(key) || { ..._id, quantity: 0 };
        prev.quantity += quantity * modifier;
        inventoryMap.set(key, prev);
      });
    };

    addToMap(purchases, 1);
    addToMap(transfersIn, 1);
    addToMap(transfersOut, -1);

    
    const inventory = [];

    inventoryMap.forEach(({ baseId, equipmentType, itemName, quantity }) => {
      if (quantity <= 0) return; 

      const base = bases.find(b => b._id.toString() === baseId.toString());
      if (base) {
        inventory.push({
          baseId: base._id,
          base: base.base_name,
          location: base.location,
          equipmentType,
          itemName,
          totalQuantity: quantity
        });
      }
    });

  
    inventory.sort((a, b) => a.base.localeCompare(b.base));

    res.status(200).json({ success: true, inventory });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory', error });
  }
};
