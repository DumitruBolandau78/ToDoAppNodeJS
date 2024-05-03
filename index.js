const express = require('express');
const dotenv = require('dotenv');
const hbsrs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const MongoToDo = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

const hbs = hbsrs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

const store = new MongoToDo({
    collections: 'sessions',
    uri: process.env.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use('/', homeRoute);
app.use('/auth', authRoute);

async function start(){
    try {        
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on ${PORT} port.`);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

start();