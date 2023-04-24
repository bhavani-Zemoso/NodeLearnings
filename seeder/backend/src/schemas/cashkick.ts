import { Schema, model, Types } from 'mongoose';

interface ICashkick {
	name: string;
	status: string;
	maturity: Date;
	total_received: number;
	total_financed: number;
	contracts: [
		{
			contract_id: Types.ObjectId;
			payment_amount: number;
		}
	];
	payment_id: Types.ObjectId;
	user_id: Types.ObjectId;
}

const cashkickSchema = new Schema<ICashkick>({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: {
			values: ['Pending', 'Approved'],
			message: '{VALUE} is not supported',
		},
		required: true,
	},
	maturity: {
		type: Date,
		required: true,
	},
	total_received: {
		type: Number,
		required: true,
	},
	total_financed: {
		type: Number,
		required: true,
	},
	contracts: [
		{
			contract_id: {
				type: Schema.Types.ObjectId,
				ref: 'Contract',
				required: true,
			},
			payment_amount: {
				type: Number,
				required: true,
			},
		},
	],
	payment_id: {
		type: Schema.Types.ObjectId,
		ref: 'Payment',
		required: true,
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
});

const Cashkick = model<ICashkick>('Cashkick', cashkickSchema);

export default Cashkick;
