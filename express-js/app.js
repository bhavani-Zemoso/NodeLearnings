const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');

// const db = require('./utils/database');
// const { engine } = require('express-handlebars')
const app = express();
app.use(express.static(path.join(rootDir, 'public')));

app.set('view engine', 'ejs');
// app.engine('handlebars', engine({defaultLayout: 'main-layout'}));
// app.set('view engine', 'handlebars')
//app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// db.execute('SELECT * FROM product')
// 	.then((result) => console.log(result[0]))
// 	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
