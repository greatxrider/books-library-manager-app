const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('../models');
const limit = 8;

/**
 * Handler function to wrap each route.
 * @param {Function} cb - The callback function to wrap.
 * @returns {Function} - The wrapped function.
 */
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

/**
 * GET books listing.
 * Redirects to the first page of books.
 */
router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/books/page/1');
}));

/**
 * GET search books.
 * Searches for books based on query parameters and paginates the results.
 * @param {string} req.query.query - The search query.
 * @param {number} req.params.pageNumber - The page number for pagination.
 */
router.get('/search/page/:pageNumber', asyncHandler(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.params.pageNumber) || 1;
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
    const currentPath = 'search/page';
    res.render('books/index', { rows, title: 'Books', page, totalPages, currentPath, query });
}));

/**
 * GET books listing with pagination.
 * Fetches and displays a paginated list of books.
 * @param {number} req.params.pageNumber - The page number for pagination.
 */
router.get('/page/:pageNumber', asyncHandler(async (req, res) => {
    const page = parseInt(req.params.pageNumber) || 1; // Default to page 1 if not provided
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const { rows, count } = await Book.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });

    const totalPages = Math.ceil(count / limit);
    const currentPath = 'page';
    res.render('books/index', { rows, title: 'Books', page, totalPages, currentPath });
}));

/**
 * GET shows create new book form.
 * Renders the form to create a new book.
 */
router.get('/new', asyncHandler(async (req, res) => {
    res.render('books/new-book', { book: {}, title: "Books" });
}));

/**
 * POST create new book.
 * Handles the creation of a new book and saves it to the database.
 * @param {Object} req.body - The book data to create.
 */
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

/**
 * GET book detail form.
 * Fetches the details of a book by its ID and renders the update form.
 * @param {string} req.params.id - The ID of the book to fetch.
 */
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/update-book', { book, title: 'Update Book' });
    } else {
        res.status(404).render('books/page-not-found', { title: 'Book Not Found' });
    }
}));

/**
 * POST update book info.
 * Updates the information of a book by its ID.
 * @param {string} req.params.id - The ID of the book to update.
 * @param {Object} req.body - The updated book data.
 */
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

/**
 * DELETE individual book.
 * Deletes a book by its ID.
 * @param {string} req.params.id - The ID of the book to delete.
 */
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
