const express = require('express');

const cartController = require('../controllers/cart');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/cart', isAuth, cartController.getCart);

router.post('/cart', isAuth, cartController.postCart);

router.post('/cart-delete-item', isAuth, cartController.postCartDeleteProduct);

module.exports = router;