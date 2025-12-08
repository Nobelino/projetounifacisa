const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, productCtrl.listProducts);
router.post('/', authMiddleware, productCtrl.createProduct);
router.put('/:productId/promotion', authMiddleware, productCtrl.updatePromotion);
router.delete('/:productId', authMiddleware, productCtrl.deleteProduct);
router.get('/admin/all', authMiddleware, productCtrl.getAllProducts);

module.exports = router;
