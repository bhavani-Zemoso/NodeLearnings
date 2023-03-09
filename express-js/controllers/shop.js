const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/product-list', {
				prods: rows,
				docTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((error) => console.log(error));
	
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId).then(([product]) => {
		res.render('shop/product-detail', {
			docTitle: product[0].title,
			product: product[0],
			path: '/products',
		});
	})
	.catch(error => console.log(error));
	
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll().then(([rows, fieldData]) => {
		res.render('shop/index', {
			prods: rows,
			docTitle: 'Shop',
			path: '/',
		});
	})
	.catch(error => console.log(error))
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];
			for (const product of products) {
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						quantity: cartProductData.quantity,
					});
				}
			}
			res.render('shop/cart', {
				docTitle: 'Your Cart',
				path: '/cart',
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price);
	});
	res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId, (product) => {
		Cart.deleteProduct(productId, product.price);
		res.redirect('/cart');
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		docTitle: 'Checkout',
		path: '/checkout',
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		docTitle: 'Your Orders',
	});
};
