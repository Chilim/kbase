// import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Article from '../models/article';


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

//Home Route
app.get('/', (req, res) => {
    Article.find((err, articles) => {
        if (err) {
            console.error(err);
            return;
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

//Start server
app.listen(3000, () => console.log('Example on port 3000'));