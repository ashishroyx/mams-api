import Asset from '../models/asset.js';

export const addAsset = async (req, res) => {
  try {
    const assetData = req.body;

    // Initialize budgetHistory with first entry if budget is present
    if (assetData.budget) {
      assetData.budgetHistory = [{
        amount: assetData.budget,
        changedOn: new Date()
      }];
    }

    const newAsset = new Asset(assetData);
    const saved = await newAsset.save();
    res.status(201).json({ success: true, asset: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add asset', error });
  }
};

export const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate('baseId', 'base_name location')
      .populate('orderedBy', 'base_name commander_name');
    res.status(200).json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assets', error });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('baseId')
      .populate('orderedBy');

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving asset', error });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    const newBudget = req.body.budget;

    // If budget has changed, push to budgetHistory
    if (newBudget !== undefined && newBudget !== asset.budget) {
      asset.budgetHistory.push({
        amount: newBudget,
        changedOn: new Date()
      });
    }

    // Update other fields
    Object.assign(asset, req.body);

    const updated = await asset.save();

    res.json({ success: true, asset: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error });
  }
};
