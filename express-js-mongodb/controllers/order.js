const Product = require('../schemas/product');
const Order = require('../schemas/order');

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					name: req.session.user.name,
					userId: req.session.user,
				},
				products: products,
			});
			return order.save();
		})
		.then((order) => {
			console.log(order);
			return req.session.user.clearCart();
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.session.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				docTitle: 'Your Orders',
				orders: orders,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch((error) => console.log(error));
};
