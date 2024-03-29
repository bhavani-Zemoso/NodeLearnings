const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this._id = id ? new mongodb.ObjectId(id) : null;
		this.cart = cart; // {items: []}
	}

	save() {
		const db = getDb();
		return db
			.collection('users')
			.insertOne(this)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: new mongodb.ObjectId(product._id),
				quantity: newQuantity,
			});
		}

		const updatedCart = {
			items: updatedCartItems,
		};
		const db = getDb();
		return db
			.collection('users')
			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map((i) => {
			return i.productId;
		});
		return db
			.collection('products')
			.find({ _id: { $in: productIds } })
			.toArray()
			.then((products) => {
				return products.map((p) => {
					return {
						...p,
						quantity: this.cart.items.find((i) => {
							return i.productId.toString() === p._id.toString();
						}).quantity,
					};
				});
			});
	}

	deleteItemFromCart(productId) {
		const db = getDb();
		const updatedCartItems = this.cart.items.filter((item) => {
			return item.productId.toString() !== productId.toString();
		});
		return db
			.collection('users')
			.updateOne(
				{ _id: new mongodb.ObjectId(this._id) },
				{ $set: { cart: { items: updatedCartItems } } }
			);
	}

	addOrder() {
		const db = getDb();
		return this.getCart()
			.then((products) => {
				const order = {
					items: products,
					user: {
						_id: new mongodb.ObjectId(this._id),
						name: this.name,
					},
				};
				return db.collection('orders').insertOne(order);
			})
			.then((result) => {
				this.cart = { items: [] };
				return db
					.collection('users')
					.updateOne(
						{ _id: new mongodb.ObjectId(this._id) },
						{ $set: { cart: { items: [] } } }
					);
			});
	}

	getOrders() {
		const db = getDb();
		return db
			.collection('orders')
			.find({ 'user._id': new mongodb.ObjectId(this._id) })
			.toArray()
			.then((orders) => {
				console.log(orders);
				return orders;
			})
			.catch((error) => console.log(error));
	}

	static findById(userId) {
		const db = getDb();
		return db
			.collection('users')
			.findOne({ _id: new mongodb.ObjectId(userId) })
			.then((user) => {
				console.log(user);
				return user;
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

module.exports = User;
