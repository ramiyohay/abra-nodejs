const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
  port: process.env.DB_PORT || 1433,
  dialectOptions: { options: { trustServerCertificate: true } },
  logging: false
});

const User = require('./user')(sequelize, DataTypes);
const Driver = require('./driver')(sequelize, DataTypes);
const Package = require('./package')(sequelize, DataTypes);
const Delivery = require('./delivery')(sequelize, DataTypes);

// tables associations
User.hasMany(Package, { foreignKey: 'userId' });
Package.belongsTo(User, { foreignKey: 'userId' });

Driver.hasMany(Delivery, { foreignKey: 'driverId' });
Delivery.belongsTo(Driver, { foreignKey: 'driverId' });

Package.hasOne(Delivery, { foreignKey: 'packageId' });
Delivery.belongsTo(Package, { foreignKey: 'packageId' });

module.exports = { sequelize, User, Driver, Package, Delivery };
