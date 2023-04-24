import { Schema, model, Types } from 'mongoose';

interface IPayment {
	status: string;
	due_date: Date;
	expected_amount: number;
	outstanding_amount: number;
	user_id: Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>({
	status: {
		type: String,
		enum: {
			values: ['Upcoming', 'Pending'],
			message: '{VALUE} is not supported',
		},
		required: true,
	},

	due_date: {
		type: Date,
		required: true,
	},
	expected_amount: {
		type: Number,
		required: true,
	},
	outstanding_amount: {
		type: Number,
		required: true,
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
});

const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
