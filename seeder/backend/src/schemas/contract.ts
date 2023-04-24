import { Schema, model } from 'mongoose';

interface IContract {
	name: string;
	type: string;
	amount: number;
	per_payment: number;
	term_length_fee: number;
	term_length_months: number;
}

const contractSchema = new Schema<IContract>({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: {
			values: ['Monthly', 'Yearly'],
			message: '{VALUE} is not supported',
		},
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	per_payment: {
		type: Number,
		required: true,
	},
	term_length_fee: {
		type: Number,
		required: true,
	},
	term_length_months: {
		type: Number,
		required: true,
	},
});

const Contract = model<IContract>('Contract', contractSchema);

export default Contract;
