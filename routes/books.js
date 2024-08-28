const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.render('books/index', { books, title: 'Books' });
}));

/* GET shows create new book form */
router.get('/new', asyncHandler(async (req, res) => {
    res.render('books/new-book', { book: {}, title: "New Book" });
}));

/* POST create new book */
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        const book = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === "SequelizeValidationError") { // checking the error
            book = await Book.build(req.body);
            res.render('books/new-book', { book, errors: error.errors, title: "New Book" })
        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
    }
}));

/* GET book detail form. */
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/update-book', { book, title: 'Update Book' });
    } else {
        res.status(404).render('books/page-not-found', { title: 'Book Not Found' });
    }
}));

/* POST update book info. */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('books/update-book', { book, errors: error.errors, title: "Update Book" })
        } else {
            throw error;
        }
    }
}));

module.exports = router;
