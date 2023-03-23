const Product = require('../schemas/product');

exports.getCart = (req, res, _next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				docTitle: 'Your Cart',
				path: '/cart',
				products: products,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch((error) => console.log(error));
};

exports.postCart = (req, res, _next) => {
	const productId = req.body.productId;
	Product.findById(productId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect('/cart');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.removeFromCart(productId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((error) => console.log(error));
};
