const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const dotenv = require('dotenv').config()
const session = require('express-session');
const flash = require('connect-flash')
const connectDB = require('./config/db')
const adminRoutes = require('./routes/admin-routes');
const userRoutes = require('./routes/user-routes');



// Passport Authentication for user
const { loginCheck } = require('./auth/adminPassport')
loginCheck(passport)





connectDB()
const app = express();


//caching disabled for every route
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
    next();
});


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/userLayout');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true,
    resave: true
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())




app.use('/', userRoutes.routes);
app.use('/admin', adminRoutes.routes);

app.set('errorPage', false)
app.all('*', (req, res) => {
    res.render('errorPage',{layout:'errorPage'})
});

app.listen(process.env.PORT)
