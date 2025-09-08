const { Package, Driver, Delivery, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const { PACKAGE_STATUS, DRIVER_STATUS } = require('../consts');


// assign a package to the driver
// we are using row level locking to prevent two processes from assigning the same package
exports.assign = async (req, res) => {
  const { packageId, driverId } = req.body;
  
  if (!packageId || !driverId) return res.status(400).json({ message: 'missing package Id / driver Id' });

  const transaction = await sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED });
  
  try {
    // we want to lock the package row to prevent concurrent assignment
    const pkgRows = await sequelize.query(
      'SELECT * FROM Packages WITH (UPDLOCK, HOLDLOCK) WHERE id = :pid',
      { replacements: { pid: packageId }, type: QueryTypes.SELECT, transaction: transaction }
    );

    if (!pkgRows.length) { 
      await transaction.rollback(); 
      return res.status(404).json({ message: 'package not found' }); 
    }
    
    const pkg = pkgRows[0];
    
    if (pkg.status !== PACKAGE_STATUS.PENDING) { 
      await transaction.rollback(); 
      return res.status(400).json({ message: 'package not available' }); 
    }

    // check driver availability
    const driverRows = await sequelize.query(
      'SELECT * FROM Drivers WITH (UPDLOCK, HOLDLOCK) WHERE id = :did',
      { replacements: { did: driverId }, type: QueryTypes.SELECT, transaction: transaction }
    );
    
    if (!driverRows.length) { 
      await transaction.rollback();
       return res.status(404).json({ message: 'driver not found' }); 
    }
    
    const driver = driverRows[0];
    
    if (driver.status !== DRIVER_STATUS.AVAILABLE) { 
      await transaction.rollback();
       return res.status(400).json({ message: 'driver not available' }); 
    }

    // create delivery
    const delivery = await Delivery.create({ packageId, driverId, status: PACKAGE_STATUS.IN_TRANSIT }, { transaction: transaction });
    
    // update package status
    await sequelize.query('UPDATE Packages SET status = :s WHERE id = :pid', { replacements: { s: PACKAGE_STATUS.IN_TRANSIT, pid: packageId }, transaction: transaction });
    
    // set driver to unavailable
    await sequelize.query('UPDATE Drivers SET status = :s WHERE id = :did', { replacements: { s: DRIVER_STATUS.UNAVAILABLE, did: driverId }, transaction: transaction });

    // commit the transaction
    await transaction.commit();
    
    res.json(delivery);
  } catch (err) {
    await transaction.rollback();

    console.error(err);
    
    res.status(500).json({ message: 'error', error: err.message });
  }
};

// how many packages delivered today
exports.reportToday = async (req, res) => {
  const result = await sequelize.query(
    "SELECT COUNT(*) AS count FROM Deliveries WHERE CONVERT(date, updatedAt) = CONVERT(date, GETDATE()) AND status = 'delivered'",
    { type: QueryTypes.SELECT }
  );
  
  res.json({ deliveredToday: result[0].count });
};
