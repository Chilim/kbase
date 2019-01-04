import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Article from '../models/article';
import session from 'express-session';
import flash from 'connect-flash';
import expressMessages from 'express-messages';
// import { check, validationResult } from 'express-validator/check';
import articles from '../routes/articles';


// Connect database
mongoose.connect('mongodb://localhost/kbadb');
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', (err) => console.log(err));

//Create instance of Express
const app = express();

//Set view engine
app.set('view engine', 'pug');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static('public'));

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express messages middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = expressMessages(req, res);
    next();
});

// Express validator middleware
app.use(express.json());

//Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.error(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles,
            });
        } 
    });
});

// Route files
app.use('/articles', articles);

//Start server
app.listen(3000, () => console.log('Example on port 3000'));