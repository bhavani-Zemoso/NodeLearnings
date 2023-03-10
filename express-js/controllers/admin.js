const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		docTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.getProducts = (req, res, next) => {
	req.user.getProducts()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				docTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((error) => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description,
			userId: req.user.id,
		})
		.then((result) => {
			console.log('Created a product');
			res.redirect('/admin/products');
		})
		.catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	Product.findByPk(productId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			return product.save();
		})
		.then((result) => {
			console.log('Updated product');
			res.redirect('/admin/products');
		})
		.catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findByPk(productId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			console.log('DESTROYED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		res.redirect('/');
	}
	const productId = req.params.productId;
	req.user
		.getProducts({ where: { id: productId } })
		.then((products) => {
			const product = products[0];
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				docTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
			});
		})
		.catch((error) => console.log(error));
};
