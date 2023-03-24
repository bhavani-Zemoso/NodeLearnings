const Product = require('../schemas/product');
const Order = require('../schemas/order');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				docTitle: 'All Products',
				path: '/products',
				isAuthenticated: req.session.isLoggedIn
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
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				docTitle: 'Shop',
				path: '/',
			});
		})
		.catch((error) => console.log(error));
};




