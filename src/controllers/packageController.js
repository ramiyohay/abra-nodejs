const { Package } = require('../models');

// create new package
exports.create = async (req, res) => {
  const userId = req.user.id;
  const { description } = req.body;
  const pkg = await Package.create({ userId, description });
  
  res.json(pkg);
};

// get all packages
exports.list = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;
  const where = { userId };
  
  if (status) where.status = status;
  
  const offset = (page - 1) * limit;
  const items = await Package.findAll({ where, limit: parseInt(limit), offset: parseInt(offset), order: [['createdAt','DESC']] });
  
  res.json(items);
};
