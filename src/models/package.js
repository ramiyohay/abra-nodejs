module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    description: DataTypes.STRING,
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }
  }, { tableName: 'Packages' });
  
  return Package;
};
