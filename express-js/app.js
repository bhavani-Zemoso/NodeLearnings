const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	User.findByPk(1)
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

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
	.sync()
	.then((result) => {
		return User.findByPk(1);
	})
	.then((user) => {
		if (!user) {
			return User.create({ name: 'Max', email: 'max@gmail.com' });
		}
		return user;
	})
	.then((user) => {
		return user.createCart();
	})
	.then((cart) => {
		app.listen(3000);
	})
	.catch((error) => console.log(error));
