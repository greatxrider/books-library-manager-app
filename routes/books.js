const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('../models');

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
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 2; // Number of items per page
    const offset = (page - 1) * limit;

    const { rows, count } = await Book.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });

    const totalPages = Math.ceil(count / limit);
    const currentPath = req.baseUrl + req.path;
    res.render('books/index', { rows, title: 'Books', page, totalPages, currentPath });
}));

/* GET search books */
router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 2; // Number of items per page
    const offset = (page - 1) * limit;

    let books = [];
    if (query) {
        try {
            books = await Book.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { author: { [Op.like]: `%${query}%` } },
                        { genre: { [Op.like]: `%${query}%` } },
                        { year: { [Op.like]: `%${query}%` } }
                    ]
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            if (books.rows.length === 0) {
                const error = new Error(`No results found for query: "${query}"`);
                error.status = 404;
                throw error;
            }
        } catch (error) {
            if (error.name === "SequelizeValidationError") { // checking the error
                return res.render('books/index', { rows: books.rows, errors: error.errors, title: "Books" });
            } else if (error.status === 404) {
                return res.render('books/index', { rows: books.rows, error, title: "Books" });
            } else {
                throw error;
            }
        }
    } else {
        books = await Book.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
    }

    const { rows, count } = books;
    const totalPages = Math.ceil(count / limit);
    const currentPath = req.baseUrl + req.path;
    res.render('books/index', { rows, title: 'Books', page, totalPages, currentPath });
}));

/* GET shows create new book form */
router.get('/new', asyncHandler(async (req, res) => {
    res.render('books/new-book', { book: {}, title: "Books" });
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

/* Delete individual book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;
