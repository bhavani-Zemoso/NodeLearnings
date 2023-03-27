import { Schema, model, Types } from 'mongoose';

interface IUser {
	username: string;
	email: string;
	pan_number: string;
	phone_number: string;
	avatar?: string;
	cashkicks: [{ id: Types.ObjectId }];
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	pan_number: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /^[A-Z]{5}[0-9]{4}$/.test(v);
			},
			message: (props) => `${props.value} is not a valid pan number!`,
		},
	},
	phone_number: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /^((\+91?)|\+)?[7-9][0-9]{8,9}$/;
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
	avatar: {
		type: String,
		required: false,
	},
	cashkicks: [
		{
			id: Schema.Types.ObjectId,
			ref: 'Cashkick',
			required: true,
		},
	],
});

const User = model<IUser>('User', userSchema);

export default User;
