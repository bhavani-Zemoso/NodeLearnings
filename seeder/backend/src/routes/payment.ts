import express from 'express';

import paymentController from '../controllers/payment';
import checkAuthentication from '../middleware/check-auth';

const router = express.Router();

router.post('/payments', checkAuthentication, paymentController.createPayment);

router.get('/payments', checkAuthentication, paymentController.getAllPayments);

router.get(
	'/payment/:paymentId',
	checkAuthentication,
	paymentController.getPaymentById
);

router.put(
	'/payment/:paymentId',
	checkAuthentication,
	paymentController.updatePayment
);

router.delete(
	'/payment/:paymentId',
	checkAuthentication,
	paymentController.deletePayment
);

export default router;
