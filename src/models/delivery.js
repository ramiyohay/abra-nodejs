module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    packageId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    driverId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'in_transit' },
    assignmentCode: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 18 }
  }, { tableName: 'Deliveries' });
  
  return Delivery;
};
