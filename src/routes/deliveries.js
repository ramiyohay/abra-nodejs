const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const deliveryCtrl = require('../controllers/deliveryController');

router.post('/assign', auth, deliveryCtrl.assign); 
router.get('/report/today', auth, deliveryCtrl.reportToday);

module.exports = router;
