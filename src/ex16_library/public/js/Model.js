import { EventEmitter } from '/js/EventEmitter.js'
import { Errors } from '/js/infra/errors.js'
import { Calc } from '/js/infra/calc.js'

export class Model extends EventEmitter {
    constructor(data) {
        super();
        this._books = data.books || [];
        this._book = data.book || { server: {}, render: {} };

        this.err = new Errors();
        this.calc = new Calc();
    }

    _setCurrentBookFromServer(bookData) {
        const description = bookData.description.replace(/\r\n|\r|\n/g, '<br>');
        const keywords = bookData.keywords.join(', ');
        const totalRate = this.calc.average(bookData.rating).toFixed(1);
        const rates = this.calc.countEach(bookData.rating);
        const starsOne = rates[1] ? rates[1].toFixed(0) : '0';
        const starsTwo = rates[2] ? rates[2].toFixed(0) : '0';
        const starsThree = rates[3] ? rates[3].toFixed(0) : '0';
        const starsFour = rates[4] ? rates[4].toFixed(0) : '0';
        const starsFive = rates[5] ? rates[5].toFixed(0) : '0';
        let created_at = this._convertDateToLocalISO(bookData.created_at);
        let published_at = this._convertDateToLocalISO(bookData.published_at);
        created_at = created_at ? created_at : '';
        published_at = published_at ? published_at : '';

        this._book = {
            server: {
                id: bookData.id,
                title: bookData.title,
                src: bookData.src,
                author: bookData.author,
                description: bookData.description,
                keywords: bookData.keywords,
                rating: bookData.rating,
                price: bookData.price,
                created_at: bookData.created_at,
                published_at: bookData.published_at,
                votes: bookData.votes
            },
            render: {
                id: String(bookData.id),
                title: bookData.title,
                image: bookData.src,
                author: bookData.author,
                description: description,
                keywords: keywords,
                votes: String(bookData.votes),
                starsOne: starsOne,
                starsTwo: starsTwo,
                starsThree: starsThree,
                starsFour: starsFour,
                starsFive: starsFive,
                totalRate: totalRate,
                price: (+bookData.price).toFixed(2),
                created_at: created_at,
                published_at: published_at.substr(0, 10),
                popupView: 'book',
                popupHeader: 'Edit a book',
                popupDescription: bookData.description,
                popupPublishedAt: published_at.substr(0, 16)
            }
        }

        return true;
    }

    _updateCurrentBookInBooks() {
        const book = this._books.find(b => b.id === this._book.server.id);
        if (!book) return false;
        for (let prop in book) {
            book[prop] = this._book.server[prop];
        }
        book.totalRate = this.calc.average(book.rating).toFixed(1);
    }
    
    _updateBook(data) {
        const newData = {
            id: data.id || this._book.server.id,
            title: data.title || this._book.server.title,
            image: data.image || this._book.server.src,
            author: data.author || this._book.server.author,
            description: data.description || this._book.server.description,
            keywords: data.keywords || this._book.render.keywords,
            rating: data.rating
                ? JSON.stringify(data.rating)
                : JSON.stringify(this._book.server.rating),
            price: data.price || this._book.server.price,
            created_at: data.created_at || this._book.server.created_at,
            published_at: data.published_at || this._book.server.published_at,
            votes: data.votes || this._book.server.votes
        };
        const formData = this._buildFormData(newData);

        return fetch(`/api/books/${data.id}`, {
            method: 'put',
            body: formData
        })
            .then(res => this.err.resJSON(res))
            .then(book => {
                this._setCurrentBookFromServer(book);
                this._updateCurrentBookInBooks();
            });
    }

    _sendQuery({ filter, search }, field) {
        let query = filter;

        if (search !== '') {
            query += filter === '' ? '?' : '&';
            query += field + '_like=' + search;
        }

        return fetch(`/api/books${query}`);
    }

    _buildFormData(data) {
        const formData = new FormData();
        for (let prop in data) {
            if (data[prop] !== null) {
                if (typeof data[prop] === 'object'
                    && data[prop].constructor === Array) {
                    data[prop] = JSON.stringify(data[prop]);
                }
                formData.append(prop, data[prop]);
            }
        }
        return formData;
    }

    _convertDateToLocalISO(dateISO) {
        const iso = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
        if (dateISO.search(iso) === -1) return false;

        const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
        return new Date(Date.parse(dateISO) - timeZoneOffset).toISOString();
    }

    _updateBooksTotalRate(books) {
        books.forEach(book => {
            book.totalRate = this.calc.average(book.rating).toFixed(1);
        });
    }

    //------------ go to view ------------
    goBooks(data) {
        if (data === null) {
            this.getAllBooks().then(() => {
                this.emit('renderAllBooks', { books: this._books });
            });
        } else if ('filter' in data && 'search' in data) {
            this.getBooks(data).then(() => {
                this.emit('renderBooks', { books: this._books, search: data.search });
            });
        }
    }

    goBook({ params }) {
        this.getBook(params.id).then(() => {
            this.emit('renderBook', this._book.render);
        });
    }

    //------------ get data from server ------------
    getAllBooks() {
        return fetch('/api/books')
            .then(res => this.err.resJSON(res))
            .then(books => {
                this._books = books;
                this._updateBooksTotalRate(this._books);
            });
    }

    getBooks(query) {
        let action;
        if (query.search === '') {
            action = Promise.all([
                this._sendQuery(query).then(res => this.err.resJSON(res))
            ]);
        } else {
            action = Promise.all([
                this._sendQuery(query, 'title').then(res => this.err.resJSON(res)),
                this._sendQuery(query, 'author').then(res => this.err.resJSON(res)),
                this._sendQuery(query, 'keywords').then(res => this.err.resJSON(res))
            ]);
        }

        return action
            .then(dataArr => {
                return dataArr.reduce((result, books) => {
                    return result = result.concat(books.filter(book => {
                        return result.every(b => b.id !== book.id);
                    }));
                }, []);
            })
            .then(books => {
                this._books = books;
                this._updateBooksTotalRate(this._books);
            });
    }

    getBook(id) {
        return fetch(`/api/books/${id}`)
            .then(res => this.err.resRedirectJSON(res, '/books'))
            .then(book => {
                this._setCurrentBookFromServer(book);
                this._updateCurrentBookInBooks();
            });
    }

    addBook(data) {
        const formData = this._buildFormData(data);

        return fetch('/api/books', {
            method: 'post',
            body: formData
        })
            .then(res => this.err.resJSON(res))
            .then(book => {
                this._books.push(book);
                this._books.forEach(book => {
                    book.totalRate = this.calc.average(book.rating).toFixed(1);
                });
                this.emit('bookAddedFromPopup', book);
            });
    }

    deleteBook(id) {
        return fetch(`/api/books/${id}`, {
            method: 'delete',
        })
            .then(res => this.err.resJSON(res))
            .then(() => {
                this.emit('bookDeletedFromPopup', null);
            });
    }

    updateBookFromPopup(data) {
        this._updateBook(data).then(() => {
            this.emit('bookUpdatedFromPopup', this._book.render);
        });
    }

    voteBook(data) {
        let book = this._books.find(b => b.id === data.id);
        if (!book) book = this._book.server;
        else this._setCurrentBookFromServer(book);
        const rating = book.rating.slice();

        rating.push(data.rate);

        const newData = {
            id: book.id,
            title: book.title,
            image: book.src,
            author: book.author,
            description: book.description,
            keywords: book.keywords.join(', '),
            rating: rating,
            price: book.price,
            created_at: book.created_at,
            published_at: book.published_at,
            votes: rating.length
        };

        this._updateBook(newData).then(() => {
            this.emit('bookRatingUpdated', this._book.render);
        });
    }

}
