const express = require('express');

const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/cart', cartController.getCart);

router.post('/cart', cartController.postCart);

router.post('/cart-delete-item', cartController.postCartDeleteProduct);

module.exports = router;