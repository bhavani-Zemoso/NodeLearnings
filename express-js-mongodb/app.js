const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const app = express();
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	User.findById('64115e9b3a9186776b747bd1')
		.then((user) => {
			req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
	app.listen(3000);
});
