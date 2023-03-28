import express from 'express';

import paymentController from '../controllers/payment';

const router = express.Router();

router.post('/payments', paymentController.createPayment);

router.get('/payments', paymentController.getAllPayments);

router.get('/payment/:paymentId', paymentController.getPaymentById);

router.put('/payment/:paymentId', paymentController.updatePayment);

router.delete('/payment/:paymentId', paymentController.deletePayment);

export default router;