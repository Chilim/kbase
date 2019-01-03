// import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Article from '../models/article';
import expressValidator from 'express-validator';
import session from 'express-session';
import flash from 'connect-flash';
import expressMessages from 'express-messages';


// Connect Database
mongoose.connect('mongodb://localhost/kbadb');
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', (err) => console.log(err));

//Create instance of Express
const app = express();

//Set view engine
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static('public'));

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Express messages middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = expressMessages(req, res);
    next();
});

// Express validator middleware
// app.use(express.json());
// app.post('/user', (req, res) => {
//   User.create({
//     username: req.body.username,
//     password: req.body.password
//   }).then(user => res.json(user));
// });

//Home Route
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

// get article route
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});

// get edit form route
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Title',
            article: article
        });
    });
});

// Add Article Route
app.get('/articles/add', (req, res) => res.render('add_article', { title: 'Add Article' }));

// Submit POST Route
app.post('/articles/add', (req, res) => {
    const article = new Article();
    const { title, author, content } = req.body;
    article.title = title;
    article.author = author;
    article.content = content;

    article.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });

});

// Submit Edit Route
app.post('/articles/edit/:id', (req, res) => {
    const article = {};
    const { title, author, content } = req.body;
    article.title = title;
    article.author = author;
    article.content = content;
    const query = { _id: req.params.id };
    Article.update(query, article, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });

});

app.delete('/article/:id', (req, res) => {
    const query = { _id: req.params.id };
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('success');
        }
    });
});

//Start server
app.listen(3000, () => console.log('Example on port 3000'));