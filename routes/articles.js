import express from 'express';
import Article from '../models/article';
// import { check, validationResult } from 'express-validator/check';

const router = express.Router();

// Get edit form route
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Title',
            article: article
        });
    });
});

// Add article route
router.get('/add', (req, res) => res.render('add_article', { title: 'Add Article' }));

// Submit POST route
router.post('/add', (req, res) => {
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
            req.flash('success', 'Article added');
            res.redirect('/');
        }
    });
});

// router.post('/add', [
//     check('title', 'Title is required').not().isEmpty(),
//     check('author', 'Author is required').not().isEmpty(),
//     check('body', 'Body is required').not().isEmpty(),
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (errors) {
//         res.render('add_article', {
//             title: 'Add article',
//             errors: errors,
//         });
//     } else {
//         const article = new Article();
//         const { title, author, content } = req.body;
//         article.title = title;
//         article.author = author;
//         article.content = content;
    
//         article.save((err) => {
//             if(err) {
//                 console.log(err);
//                 return;
//             } else {
//                 req.flash('success', 'Article added');
//                 res.redirect('/');
//             }
//         });
//     }
// });

// Submit edit route
router.post('/edit/:id', (req, res) => {
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
            req.flash('success', 'Article updated');
            res.redirect('/');
        }
    });

});

// Delete article
router.delete('/:id', (req, res) => {
    const query = { _id: req.params.id };
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('success');
        }
    });
});

// Get article route
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});

module.exports = router;