import { Router } from '/js/infra/router.js'

export class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this.router = new Router({
            '/': Router.redirect('/books'),
            '/books': Router.route(() => this._model.goBooks(null)),
            '/books/:id': Router.route(id => this._model.goBook(id)),
            '*': Router.route(() => this._view.renderViewportMessage('Not found'))
        });

        view
            .on('addBookFromPopup', data => this.addBookFromPopup(data))
            .on('updateBookFromPopup', ev => this.updateBookFromPopup(ev))
            .on('deleteBookFromPopup', ev => this.deleteBookFromPopup(ev))
            .on('voteBook', data => this.voteBook(data))
            .on('redirectBooks', () => this.redirectBooks())
            .on('queryBooks', data => this.queryBooks(data));
    }

    addBookFromPopup(data) {
        this._model.addBook(data);
    }

    updateBookFromPopup(data) {
        this._model.updateBookFromPopup(data);
    }

    deleteBookFromPopup(data) {
        this._model.deleteBook(data.id);
    }

    voteBook(data) {
        this._model.voteBook(data);
    }

    redirectBooks() {
        this.router.go(location.origin + '/books', true);
    }

    queryBooks(data) {
        this._model.goBooks(data);
    }
}
