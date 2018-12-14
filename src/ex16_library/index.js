require('dotenv').config();

const { PORT, PUBLIC_PATH, INDEX_FILE } = process.env;

const path = require('path');

const express = require('express');
const db = require('json-server');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime');

const morgan = require('morgan');

const app = express();

app.use(express.static(path.resolve(`${__dirname}/${PUBLIC_PATH}`)));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(db.rewriter({
    '/api/books?filter=most-popular*': '/api/books?_sort=votes&_order=desc&_limit=5$1',
    '/api/books?filter=recent*': '/api/books?_sort=created_at&_order=desc&_limit=5$1',
    '/api/books?filter=free*': '/api/books?price=0$1'
}));

/* ----- image upload ----- */
const storage = multer.diskStorage({
    destination: path.resolve(`${__dirname}/${PUBLIC_PATH}/img/uploads/`),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

mime.define({'image/web': ['jpg', 'jpeg', 'gif', 'png']}, true);

function checkFileType(file, cb) {
		if (mime.getType(path.extname(file.originalname)) === 'image/web') return cb(null, true);
		cb(new Error('Error: Images only!'));
}

function clearDBObject(obj, type) {
    const DBData = {
        title: obj.title,
        src: obj.src,
        author: obj.author,
        description: obj.description,
        keywords: obj.keywords,
        rating: obj.rating,
        price: obj.price,
        created_at: obj.created_at,
        published_at: obj.published_at,
        votes: obj.votes
    }
    if (type === 'update') DBData.id = obj.id;
    return DBData;
}

app.post('/api/books', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            res.send('Error: File upload error.');
        } else {
            req.body.title = req.body.title
                ? req.body.title.trim()
                : '';
            req.body.src = req.body.image
                ? req.body.image
                : req.file && req.file.filename
                    ? `/img/uploads/${req.file.filename}`
                    : '/img/default.jpg';
            req.body.author = req.body.author
                ? req.body.author.trim()
                : '';
            req.body.description = req.body.description
                ? req.body.description.trim()
                : '';
            req.body.keywords = req.body.keywords.trim()
                ? req.body.keywords.trim()
                    .replace(/\s+/g, ' ')
                    .split(',').map(str => str.trim())
                    .filter(str => str !== '')
                : [];
            req.body.rating = [];
            req.body.price = String(req.body.price)
                ? +req.body.price
                : 0;
            req.body.created_at = new Date(Date.now()).toISOString();
            const iso = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
            req.body.published_at = req.body.published_at.search(iso) !== -1
                ? req.body.published_at
                : req.body.created_at;
            req.body.votes = 0;

            req.body = clearDBObject(req.body, 'add');
        }
        next();
    });
});

app.put('/api/books/:id', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            res.send('Error: File upload error.');
        } else {
            if (!req.body.id) {
                res.send('Error: ID was not received.');
            }
            req.body.title = req.body.title
                ? req.body.title.trim()
                : '';
            req.body.src = req.body.image
                ? req.body.image
                : req.file && req.file.filename
                    ? `/img/uploads/${req.file.filename}`
                    : '/img/default.jpg';
            req.body.author = req.body.author
                ? req.body.author.trim()
                : '';
            req.body.description = req.body.description
                ? req.body.description.trim()
                : '';
            req.body.keywords = req.body.keywords.trim()
                ? req.body.keywords.trim()
                    .replace(/\s+/g, ' ')
                    .split(',').map(str => str.trim())
                    .filter(str => str !== '')
                : [];
            req.body.rating = req.body.rating
                ? JSON.parse(req.body.rating)
                : [];
            req.body.price = String(req.body.price)
                ? +req.body.price
                : 0;
            req.body.created_at = req.body.created_at;
            const iso = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
            req.body.published_at = req.body.published_at.search(iso) !== -1
                ? req.body.published_at
                : '';
            req.body.votes = String(req.body.votes)
                ? +req.body.votes
                : 0;

            req.body = clearDBObject(req.body, 'update');
        }
        next();
    });
});
/* ------------------------ */

app.use('/api', db.router(path.resolve(`${__dirname}/db/library.json`)));

app.get('*', (_, res) => {
    res.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, INDEX_FILE));
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
