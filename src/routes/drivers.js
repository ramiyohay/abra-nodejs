const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const driverCtrl = require('../controllers/driverController');

router.patch('/:id/status', auth, driverCtrl.updateStatus);
router.get('/available', auth, driverCtrl.available);
router.get('/:id/deliveries', auth, driverCtrl.driverDeliveries);
router.get('/forecast', auth, driverCtrl.forecast);

module.exports = router;
