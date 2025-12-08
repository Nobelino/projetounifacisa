const express = require('express');
const router = express.Router();
const purchaseCtrl = require('../controllers/purchaseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, purchaseCtrl.recordPurchase);
router.get('/history', authMiddleware, purchaseCtrl.getPurchaseHistory);
router.get('/top-categories', authMiddleware, purchaseCtrl.getTopCategories);

module.exports = router;
