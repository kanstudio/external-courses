require('dotenv').config();

const { PORT, PUBLIC_PATH, INDEX_FILE } = process.env;

const path = require('path');

const router = require('express').Router();
const multer = require('multer');
const mime = require('mime');

const db = require('json-server');

router.use(db.rewriter({
    '/?filter=most-popular*': '/?_sort=votes&_order=desc&_limit=5$1',
    '/?filter=recent*': '/?_sort=created_at&_order=desc&_limit=5$1',
    '/?filter=free*': '/?price=0$1'
}));

//-------- image upload --------
const storage = multer.diskStorage({
    destination: path.resolve(`${__dirname}/../${PUBLIC_PATH}/img/uploads/`),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    if (mime.getType(path.extname(file.originalname)) === 'image/web') return cb(null, true);
    cb(new Error('Error: Images only!'));
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

mime.define({ 'image/web': ['jpg', 'jpeg', 'gif', 'png'] }, true);

//-------- receive requests --------
function prepareBook(data, file, type) {
    const iso = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

    const book = {
        title: data.title
            ? data.title.trim()
            : '',
        src: data.image
            ? data.image
            : file && file.filename
                ? `/img/uploads/${file.filename}`
                : '/img/default.jpg',
        author: data.author
            ? data.author.trim()
            : '',
        description: data.description
            ? data.description.trim()
            : '',
        keywords: data.keywords.trim()
            ? data.keywords.trim()
                .replace(/\s+/g, ' ')
                .split(',').map(str => str.trim())
                .filter(str => str !== '')
            : [],
        rating: data.rating
            ? JSON.parse(data.rating)
            : [],
        price: String(data.price)
            ? +data.price
            : 0,
        published_at: data.published_at.search(iso) !== -1
            ? data.published_at
            : '',
        votes: +data.votes || 0
    }

    switch (type) {
        case 'add':
            book.created_at = new Date(Date.now()).toISOString();
            break;
        case 'update':
            book.id = data.id;
            book.created_at = data.created_at;
    }

    return book;
}

router.post('/', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            res.send('Error: File upload error.');
        } else {
            req.body = prepareBook(req.body, req.file, 'add');
            next();
        }
    });
});

router.put('/:id', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            res.send('Error: File upload error.');
        } else {
            if (!req.body.id) {
                res.send('Error: ID was not received.');
            } else {
                req.body = prepareBook(req.body, req.file, 'update');
                next();
            }
        }
    });
});

module.exports = router;
