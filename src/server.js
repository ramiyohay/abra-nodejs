require('dotenv').config();

const express = require('express');
const app = express();
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const driverRoutes = require('./routes/drivers');
const deliveryRoutes = require('./routes/deliveries');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

app.use(express.json());

// set all routes
app.use('/auth', authRoutes);
app.use('/packages', packageRoutes);
app.use('/drivers', driverRoutes);
app.use('/deliveries', deliveryRoutes);

// get all swagger data
const swaggerDoc = YAML.load('./src/docs/swagger.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get('/', (req, res) => res.send('My Delivery Service'));

const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  console.log('DB connected');
  app.listen(PORT, () => console.log('Server listening on', PORT));
}).catch(err => {
  console.error('Connection to DB failed! reason:', err);
  app.listen(PORT, () => console.log('Server listening (no DB):', PORT));
});
