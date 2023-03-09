const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	//res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('admin/edit-product', {
		docTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			docTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;
	// products.push({ title: req.body.title });
	const product = new Product(null, title, imageUrl, description, price);
	product
		.save()
		.then(() => {
			res.redirect('/');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedProduct = new Product(
		productId,
		updatedTitle,
		updatedImageUrl,
		updatedDescription,
		updatedPrice
	);
	updatedProduct.save();
	res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteById(productId);
	res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		res.redirect('/');
	}
	const productId = req.params.productId;
	Product.findById(productId, (product) => {
		if (!product) {
			return res.redirect('/');
		}
		//res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
		res.render('admin/edit-product', {
			docTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
		});
	});
};
