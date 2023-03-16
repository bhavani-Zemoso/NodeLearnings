const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();

router.post('/create-order', orderController.postOrder);

router.get('/orders', orderController.getOrders);

module.exports = router;