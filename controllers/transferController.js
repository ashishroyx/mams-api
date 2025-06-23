// controllers/transferController.js
import Transfer from '../models/transfer.js';

export async function createTransfer(req, res) {
  try {
    const { itemName, equipmentType, quantity, transferCost, fromBase, toBase } = req.body;

    if (fromBase === toBase) {
      return res.status(400).json({ success: false, message: "Cannot transfer within the same base." });
    }

    const transfer = new Transfer({
      itemName,
      equipmentType,
      quantity,
      transferCost,
      fromBase,
      toBase,
      transferDate: new Date(),
    });

    const saved = await transfer.save();
    res.status(201).json({ success: true, transfer: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Transfer failed', error: error.message });
  }
}

export async function getAllTransfers(req, res) {
  try {
    const transfers = await Transfer.find()
      .populate('fromBase', 'base_name location')
      .populate('toBase', 'base_name location')
      .sort({ transferDate: -1 });

    res.status(200).json({ success: true, transfers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transfers', error: error.message });
  }
}
