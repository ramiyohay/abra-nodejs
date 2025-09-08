const { DRIVER_STATUS } = require('../consts');
const { Driver, Delivery, Package, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// update driver status
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const driver = await Driver.findByPk(id);
  
  if (!driver) return res.status(404).json({ message: 'driver not found' });
  
  driver.status = status;
  
  await driver.save();
  
  res.json(driver);
};

// get all avail drivers
exports.available = async (req, res) => {
  const drivers = await Driver.findAll({ where: { status: DRIVER_STATUS.AVAILABLE }});
  
  res.json(drivers);
};

// get all driver deliveris
// joining related tables for better optimization 
exports.driverDeliveries = async (req, res) => {
  const id = req.params.id;
  const deliveries = await Delivery.findAll({
    where: { driverId: id },
    include: [
      { model: Package, include: [{ model: User, attributes: ['id','email','name'] }] }
    ],
    order: [['createdAt','DESC']]
  });

  res.json(deliveries);
};

// forecast for avail drivers 
exports.forecast = async (req, res) => {
  const drivers = await Driver.findAll();

  // we want to check how many recent delivers the driver had during the last hour
  // if he/she has none, they are probably available
  const availNextHour = await Promise.all(drivers.map(async d => {
    const recentDeliveries = await Delivery.count({
      where: {
        driverId: d.id,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) // last 1 hour
        }
      }
    });
    
    return {
      id: d.id,
      name: d.name,
      availNextHour: recentDeliveries === 0 
    };
  }));

  res.json(availNextHour);
};

