const path = require('path');

const router = require('express').Router();

const db = require('json-server');

const books = require('./books');

router.use('/books', books);

router.use('/', db.router(path.resolve(`${__dirname}/../db/library.json`)));

module.exports = router;
