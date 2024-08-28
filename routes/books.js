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

/* GET book details */
router.get('/books/:id', asyncHandler(async (req, res) => {
    const books = await Book.findByPk(req.params.id);
    const booksJSON = books.map(book => book.toJSON());
    console.log(booksJSON);
    res.render('books/')
}))


module.exports = router;