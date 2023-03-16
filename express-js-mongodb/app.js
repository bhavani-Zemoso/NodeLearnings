const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rootDir = require('./utils/path');

const errorController = require('./controllers/error');
const User = require('./schemas/user');

const app = express();
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	User.findById('6412cc233843d882d09bc405')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((error) => console.log(error));
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order')

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		'mongodb+srv://bhav_somanchi:R2kLQmUPDyzshqYl@cluster0.cwzcopu.mongodb.net/shop?retryWrites=true&w=majority'
	)
	.then((result) => {
		console.log('Connected!');
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Bhavani',
					email: 'bhavanisomanchi06@gmail.com',
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((error) => {
		console.log(error);
	});
