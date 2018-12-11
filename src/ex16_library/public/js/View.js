import { EventEmitter } from '/js/EventEmitter.js'
import { Viewport } from '/js/infra/viewport.js'
import { html } from '/js/infra/template.js'

import bookTpl from '/tpl/book.tpl.js'
import bookViewTpl from '/tpl/book-view.tpl.js'
import bookRatingTpl from '/tpl/book-rating.tpl.js'
import booksViewTpl from '/tpl/books-view.tpl.js'
import viewMessageTpl from '/tpl/view-message.tpl.js'
import popupTpl from '/tpl/popup-view.tpl.js'
import popupButtonTpl from '/tpl/popup-button.tpl.js'
import popupMessageTpl from '/tpl/popup-message.tpl.js'

export class View extends EventEmitter {
    constructor(model) {
        super();
        this._model = model;
        this.buttonMain = document.querySelector('.button-main');
        this.popupWindow = document.querySelector('.popup');
        this.popupForm = document.querySelector('.popup-form');
        this.popupMessage = document.querySelector('#popup .popup-message');

        this.viewport = new Viewport(document.getElementById('viewport'));
        this.popup = new Viewport(document.getElementById('popup'));

        this.eventsCounter = 0;

        model
            .on('renderAllBooks', data => this.renderBooksView(data))
            .on('renderBook', data => this.renderBookView(data))
            .on('bookAddedFromPopup', book => {
                this.insertBookToList(book);
                this.showMessageAndClose('The book was added!')
                    .then(() => this.resetForm(this.popupForm));
            })
            .on('bookUpdatedFromPopup', book => {
                if (location.pathname !== '/books') {
                    this.renderBookView(book);
                }
                this.showMessageAndClose('The book was updated!')
                    .then(() => this.resetForm(this.popupForm));
            })
            .on('bookDeletedFromPopup', () => {
                this.buttonMain.setAttribute('data-action', 'none');
                this.buttonMain.querySelector('span').textContent = '';

                const bookView = html([viewMessageTpl], {
                    messageText: 'The book was deleted!'
                }).clone();

                this.viewport.renderView(bookView);

                this.showMessageAndClose('The book was deleted!')
                    .then(() => {
                        this.resetForm(this.popupForm);
                    });
            })
            .on('bookRatingUpdated', book => {
                const bookFields = this.viewport.el.querySelector(`.book[data-id="${book.id}"] .book-fields`);
                const stars = bookFields.querySelector('[data-voted]');
                while (stars.firstChild) {
                    stars.firstChild.remove();
                }
                stars.append(this.renderBookRating(book.totalRate));

                const totalRate = bookFields.querySelector('.book-total-rate span');
                if (totalRate) totalRate.textContent = book.totalRate;

                const ratesCount = bookFields.querySelector('.book-rates-count');
                if (ratesCount) {
                    const votesCount = ratesCount.querySelector('.book-votes-count span');
                    votesCount.textContent = book.votes;
                    ratesCount.querySelector('[data-stars="1"] span').textContent = book.starsOne;
                    ratesCount.querySelector('[data-stars="2"] span').textContent = book.starsTwo;
                    ratesCount.querySelector('[data-stars="3"] span').textContent = book.starsThree;
                    ratesCount.querySelector('[data-stars="4"] span').textContent = book.starsFour;
                    ratesCount.querySelector('[data-stars="5"] span').textContent = book.starsFive;
                }

                setTimeout(() => {
                    stars.setAttribute('data-voted', 'no');
                }, 2000);
            })
            .on('renderBooks', data => {
                const books = this.renderBooksView(data);
                if (books !== false) {
                    this.highlightSearch(books, data.search);
                }
            });
    }

    init() {
        const that = this;

        this.buttonMain.addEventListener('click', () => {
            that.openPopup();
        });

        this.popupWindow.addEventListener('click', ev => {
            const action = ev.target.getAttribute('data-action');
            let data;

            switch (action) {
                case 'add':
                    data = that.checkForm(ev);
                    if (data !== false) {
                        that.emit('addBookFromPopup', data);
                    }
                    break;
                case 'update':
                    data = that.checkForm(ev);
                    if (data !== false) {
                        that.emit('updateBookFromPopup', data);
                    }
                    break;
                case 'delete':
                    data = that.checkForm(ev);
                    that.emit('deleteBookFromPopup', data);
                    break;
                default:
                    that.closePopup(ev);
            }
        });

        this.viewport.el.addEventListener('click', ev => {
            if (ev.target.closest('.book-rating-star') !== null) {
                const stars = ev.target.closest('[data-voted]');
                stars.setAttribute('data-voted', 'yes');
                const id = +ev.target.closest('.book').getAttribute('data-id');
                const rate = +ev.target.closest('[data-rate]').getAttribute('data-rate');
                that.emit('voteBook', { id, rate });
            } else if (ev.target.closest('.book-image-link') !== null) {
                if (location.pathname !== '/books') {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                }
                that.resetFilterSearch();
            }
        });

        document.querySelector('.filter-search .filter').addEventListener('click', ev => {
            if (location.pathname !== '/books') {
                that.emit('redirectBooks', null);
            };
            that.queryBooks(ev);
        });

        document.querySelector('.search-field [name="search"]').addEventListener('keyup', ev => {
            if (location.pathname !== '/books') {
                that.emit('redirectBooks', null);
            };
            that.queryBooks(ev);
        });

        document.querySelector('.search-field [name="submit"]').addEventListener('click', ev => {
            if (location.pathname !== '/books') {
                that.emit('redirectBooks', null);
            };
            that.resetSearch(ev);
        });

        this.accordion('.accordion-menu', 400);
    }

    // ------------ render books ------------
    renderBooksView(data) {
        const buttonMain = document.querySelector('.button-main');
        buttonMain.setAttribute('data-action', 'add');
        buttonMain.querySelector('span').textContent = 'Add a book';

        this.renderPopup({
            popupView: 'books',
            popupHeader: 'Add a book'
        });

        if (!data.books.length) {
            this.renderViewportMessage('No books were found');
            return false;
        }

        const booksView = html`${booksViewTpl}`.clone();
        booksView.querySelector('.books-list').append(
            this.viewport.renderCollection(data.books, this.renderSmallBook.bind(this))
        );

        this.viewport.renderView(booksView);

        return data.books;
    }

    renderSmallBook(book) {
        const markup = html([bookTpl], {
            id: book.id,
            title: book.title,
            author: book.author,
            path: `/books/${book.id}`,
            image: book.src,
            totalRate: book.totalRate
        }).clone();
        markup.querySelector('.book-rating-stars').append(
            this.renderBookRating(book.totalRate)
        );
        return markup;
    }

    renderBookRating(totalRate) {
        const stars = document.createDocumentFragment();
        for (let i = 1; i <= 5; i++) {
            let suffix = '';
            if (Math.ceil(+totalRate * 2) < i * 2) {
                if (+totalRate > i - 1) suffix += '-half';
                suffix += '-o';
            }
            const star = html([bookRatingTpl], {
                rate: i,
                suffix: suffix
            }).clone();
            stars.append(star);
        }
        return stars;
    }

    renderBookView(book) {
        const buttonMain = document.querySelector('.button-main');
        buttonMain.setAttribute('data-action', 'edit');
        buttonMain.querySelector('span').textContent = 'Edit a book';

        this.resetFilterSearch();

        const markup = html([bookViewTpl], book).clone();

        markup.querySelector('.book-rating-stars').append(
            this.renderBookRating(book.totalRate)
        );

        this.viewport.renderView(markup);

        this.renderPopup(book);
    }

    renderViewportMessage(text) {
        const bookView = html([viewMessageTpl], {
            messageText: text
        }).clone();

        this.viewport.renderView(bookView);
    }

    // ------------ popup ------------
    openPopup() {
        const action = this.buttonMain.getAttribute('data-action');

        switch (action) {
            case 'none':
                return false;
            case 'add':
                const published = document.querySelector('.popup-form [name="published_at"]');
                const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
                const date = new Date(Date.now() - timeZoneOffset);
                published.value = date.toISOString().substr(0, 16);
                break;
            case 'edit':
                this.renderPopup(this._model._book.render);
        }

        this.popupWindow.style.display = 'flex';
        setTimeout(() => {
            this.popupWindow.setAttribute('data-view', 'show');
        }, 0);
    }

    closePopup(ev) {
        if (!ev || ev.target.getAttribute('data-view') === 'show' ||
            ev.target.closest('.popup-close')) {
            this.popupWindow.setAttribute('data-view', 'hide');
            setTimeout(() => {
                this.popupWindow.style.display = 'none';
            }, 300);
        }
    }

    renderPopup(book) {
        const popupData = {
            header: book.popupHeader ? book.popupHeader : '',
            title: book.title ? book.title : '',
            author: book.author ? book.author : '',
            description: book.popupDescription ? book.popupDescription : '',
            keywords: book.keywords ? book.keywords : '',
            image: book.image ? book.image : '',
            price: book.price ? book.price : '',
            published_at: book.popupPublishedAt ? book.popupPublishedAt : '',
        };

        const popupView = html([popupTpl], popupData).clone();

        switch (book.popupView) {
            case 'books':
                popupView.querySelector('.popup-buttons').append(
                    this.renderPopupButton({
                        type: 'submit',
                        class: 'popup-addbook',
                        attribute: 'data-action="add"',
                        text: 'Add'
                    })
                );
                break;
            case 'book':
                popupView.querySelector('.popup-buttons').append(
                    this.renderPopupButton({
                        type: 'button',
                        class: 'popup-delbook',
                        attribute: 'data-action="delete"',
                        text: 'Delete'
                    })
                );
                popupView.querySelector('.popup-buttons').append(
                    this.renderPopupButton({
                        type: 'submit',
                        class: 'popup-savebook',
                        attribute: 'data-action="update"',
                        text: 'Update'
                    })
                );
                break;
        }

        this.popup.renderView(popupView);

        this.popupForm = document.querySelector('.popup-form');
        this.popupMessage = document.querySelector('#popup .popup-message');
    }

    renderPopupButton(button) {
        const markup = html([popupButtonTpl], {
            type: button.type,
            class: button.class,
            attribute: button.attribute,
            text: button.text
        }).clone();

        return markup;
    }

    showMessageAndClose(text) {
        const messageText = html([popupMessageTpl], {
            messageText: text
        }).clone();

        this.popupMessage.style.display = 'block';
        this.popupMessage.style.opacity = '0';
        this.popupMessage.append(messageText);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.popupMessage.style.opacity = '1';
            }, 0);
            setTimeout(() => {
                this.popupMessage.getElementsByTagName('div')[0].style.opacity = '1';
            }, 300);
            setTimeout(() => {
                this.closePopup();
                this.popupMessage.style.display = 'none';
                this.popupMessage.style.opacity = '0';
                this.popupMessage.getElementsByTagName('div')[0].style.opacity = '0';
                resolve(true);
            }, 2000);
        });
    }

    // ------------ manage books -------------
    checkForm(ev) {
        const title = this.popupForm.querySelector('[name="title"]').value.trim();
        const author = this.popupForm.querySelector('[name="author"]').value.trim();
        const price = this.popupForm.querySelector('[name="price"]').value;
        if (title && author && price) ev.preventDefault();
        else return false;

        const description = this.popupForm.querySelector('[name="description"]').value.trim();
        const keywords = this.popupForm.querySelector('[name="keywords"]').value.trim();
        const imageEl = this.popupForm.querySelector('[name="image"]');
        const image = imageEl.getAttribute('value') === ''
            ? imageEl.files[0]
                ? imageEl.files[0]
                : ''
            : imageEl.value
                ? imageEl.files[0]
                : imageEl.getAttribute('value');
        const publishedAt = this.popupForm.querySelector('[name="published_at"]').value.trim();
        const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
        const published_at = publishedAt.search(isoLike) !== -1
            ? new Date(Date.parse(publishedAt)).toISOString()
            : '';

        const books = this.viewport.el.querySelectorAll('.book');
        const id = books.length > 1 ? null : +books[0].getAttribute('data-id');

        return { id, title, author, description, keywords, image, price, published_at };
    }

    insertBookToList(newBook) {
        const book = this.renderSmallBook(newBook);
        this.viewport.prepend(book, '.books-list');
    }

    // ------------ reset -------------
    resetForm(form) {
        form.reset();
        const files = form.querySelectorAll('[type="file"]');
        files.forEach(el => el.value = '');
        const dates = form.querySelectorAll('[type="datetime-local"]');
        dates.forEach(el => el.value = '');
    }

    resetFilterSearch() {
        const filter = document.querySelector('.filter-search .filter');
        const search = document.querySelector('.search-field [name="search"]');
        const filterItems = filter.querySelectorAll('[data-filter]');
        filterItems.forEach(item => item.classList.remove('active'));
        search.value = '';
    }

    resetSearch(ev) {
        ev.preventDefault();
        const search = ev.target.closest('.search-field').querySelector('[name="search"]');
        search.value = '';
        this.queryBooks({ target: false });
    }

    // ------------ filter and search ------------
    queryBooks(ev) {
        let filter = document.querySelector('.filter-search .filter .active');
        let timeout = 660;

        const target = ev.target;
        if (target && target.hasAttribute('data-filter')) {
            if (target.classList.contains('active')) return false;
            if (filter) filter.classList.remove('active');
            target.classList.add('active');
            filter = target;
            timeout = 0;
            this.eventsCounter = 0;
        }
        if (target === false) {
            timeout = 0;
            this.eventsCounter = 0;
        }

        let option = filter ? filter.getAttribute('data-filter') : 'all';
        option = option === 'all' ? '' : '?filter=' + option;

        const search = document.querySelector('.search-field [name="search"]');
        const phrase = search.value.trim();

        this.eventsCounter++;

        new Promise((resolve, reject) => {
            setTimeout(() => resolve(), timeout);
        }).then(() => {
            if (this.eventsCounter !== 1) {
                if (this.eventsCounter > 1) this.eventsCounter--;
                return false;
            }
            this.eventsCounter = 0;

            this.emit('queryBooks', { filter: option, search: phrase });
        });
    }

    highlightSearch(books, phrase) {
        books.forEach(book => {
            book = document.querySelector(`.books-list [data-id="${book.id}"]`);
            if (book) {
                const title = book.querySelector('.book-title');
                const author = book.querySelector('.book-author');
                title.innerHTML = title.textContent.replace(/<b[^>]>/g, '').replace(/<\/b>/g, '');
                author.innerHTML = author.textContent.replace(/<b[^>]>/g, '').replace(/<\/b>/g, '');
                if (!phrase) return false;

                const reg = new RegExp(phrase, 'ig');
                const inTitle = title.textContent.search(reg);
                const inAuthor = author.textContent.search(reg);
                if (inTitle !== -1) {
                    title.innerHTML = title.textContent.replace(reg, '<b style="font-weight: inherit; background-color: #a8deff;">$&</b>');
                }
                if (inAuthor !== -1) {
                    author.innerHTML = author.textContent.replace(reg, '<b style="font-weight: inherit; background-color: #a8deff;">$&</b>');
                }
            }
        });
    }

    // ------------ accordion ------------
    accordion(selector, speed = 300) {
        const elements = document.querySelectorAll(selector);
    
        for (let i = 0; i < elements.length; i++) {
            this.setAccordion(elements[i], speed);
        }
    }

    setAccordion(menu, speed) {
        const items = menu.children;
        for (let i = 0; i < items.length; i++) {
            const submenu = items[i].getElementsByTagName('ul')[0];
            submenu.style.transition = 'max-height ease ' + speed + 'ms';
            if (items[i].classList.contains('menu-active')) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
            else {
                submenu.style.maxHeight = '0px';
            }
        }
        menu.addEventListener('click', ev => {
            const target = ev.target.closest('.accordion-menu > li');
            if (target && !target.classList.contains('menu-active')) {
                const active = menu.getElementsByClassName('menu-active')[0];
                if (active) {
                    active.classList.remove('menu-active');
                    active.getElementsByTagName('ul')[0].style.maxHeight = '0px';
                }
                target.classList.add('menu-active');
                const submenu = target.getElementsByTagName('ul')[0];
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
    }
}
