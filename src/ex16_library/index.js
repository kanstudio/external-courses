require('dotenv').config();

const { PORT, PUBLIC_PATH, INDEX_FILE } = process.env;

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');

const app = express();

const api = require('./routes');

app.use(express.static(path.resolve(`${__dirname}/${PUBLIC_PATH}`)));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/api', api);

app.get('*', (_, res) => {
    res.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, INDEX_FILE));
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
