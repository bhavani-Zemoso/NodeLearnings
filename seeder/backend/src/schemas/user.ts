import { Schema, model, Types } from 'mongoose';

interface IUser {
	username: string;
	email: string;
	password: string;
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
	password: {
		type: String,
		required: true,
	},
	pan_number: {
		type: String,
		required: true,
		validate: {
			validator: function (v: string) {
				return /^[A-Z]{5}\d{4}$/.test(v);
			},
			message: (props) => `${props.value} is not a valid pan number!`,
		},
	},
	phone_number: {
		type: String,
		required: true,
		validate: {
			validator: function (v: string) {
				return /^((\+91?)|\+)?[7-9]\d{8,9}$/;
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
			id: {
				type: Schema.Types.ObjectId,
				ref: 'Cashkick',
				required: true,
			},
		},
	],
});

const User = model<IUser>('User', userSchema);

export default User;
