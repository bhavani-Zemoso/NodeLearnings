const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				docTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((error) => console.log(error));
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			res.render('shop/product-detail', {
				docTitle: product.title,
				product: product,
				path: '/products',
			});
		})
		.catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				docTitle: 'Shop',
				path: '/',
			});
		})
		.catch((error) => console.log(error));
};

exports.getCart = (req, res, _next) => {
	req.user
		.getCart()
		.then((products) => {
			res.render('shop/cart', {
				docTitle: 'Your Cart',
				path: '/cart',
				products: products,
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
		.deleteItemFromCart(productId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((error) => console.log(error));
};

exports.postOrder = (req, res, next) => {
	req.user
		.addOrder()
		.then((order) => {
			console.log(order);
			res.redirect('/orders');
		})
		.catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				docTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((error) => console.log(error));
};
