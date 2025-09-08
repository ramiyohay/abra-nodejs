module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    name: DataTypes.STRING,
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'available' }
  }, { tableName: 'Drivers' });
  
  return Driver;
};
