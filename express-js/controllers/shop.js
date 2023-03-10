const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll()
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
	Product.findByPk(productId)
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
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				docTitle: 'Shop',
				path: '/',
			});
		})
		.catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts();
		})
		.then((products) => {
			res.render('shop/cart', {
				docTitle: 'Your Cart',
				path: '/cart',
				products: products,
			});
		})
		.catch((error) => console.log(error));
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	let fetchCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchCart = cart;
			return cart.getProducts({ where: { id: productId } });
		})
		.then((products) => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}
			if (product) {
				const oldQuantity = product.cartItem.quantity;
				newQuantity = oldQuantity + 1;
				return product;
			}
			return Product.findByPk(productId);
		})
		.then((product) => {
			return fetchCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: productId } });
		})
		.then((products) => {
			const product = products[0];
			product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((error) => console.log(error));
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		docTitle: 'Checkout',
		path: '/checkout',
	});
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			req.user
				.createOrder()
				.then((order) => {
					return order
						.addProducts(
							products.map((product) => {
								product.orderItem = { quantity: product.cartItem.quantity };
								return product;
							})
						)
						.catch((error) => console.log(error));
				})
				.then((result) => {
					fetchedCart.setProducts(null);
					res.redirect('/orders');
				})
				.catch((error) => console.log(error));
			console.log(products);
		})
		.catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({include: ['products']})
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				docTitle: 'Your Orders',
				orders: orders
			});
		})
		.catch((error) => console.log(error));
};
