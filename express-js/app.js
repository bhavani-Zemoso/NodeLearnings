const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const { engine } = require('express-handlebars')
const app = express();

app.set('view engine', 'ejs')
// app.engine('handlebars', engine({defaultLayout: 'main-layout'}));
// app.set('view engine', 'handlebars')
//app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req,res,next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', 'error.html'))
    res.status(404).render('error', {docTitle: 'Page not found'})
});

app.listen(3000);
