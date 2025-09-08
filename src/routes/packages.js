const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const pkgCtrl = require('../controllers/packageController');

router.post('/', auth, pkgCtrl.create);
router.get('/', auth, pkgCtrl.list);

module.exports = router;
