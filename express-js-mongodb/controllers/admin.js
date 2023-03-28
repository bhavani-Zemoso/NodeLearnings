const mongodb = require('mongodb')
const Product = require('../schemas/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
	if(!req.session.isLoggedIn) {
		return res.redirect('/login')
	}
	res.render('admin/edit-product', {
		docTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.getProducts = (req, res, next) => {
	Product.find({userId: req.user._id})
		.then((products) => {
			console.log(products);
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
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user
	});
	product
		.save()
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
	Product.findById(productId)
		.then((product) => {
			if(product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/')
			}
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
	Product.deleteOne({_id: productId, userId: req.user._id})
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
	Product.findById(productId)
		.then((product) => {
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
