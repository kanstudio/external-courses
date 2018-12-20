export class Viewport {
    constructor(el) {
        this.el = el;
    }

    renderCollection(collection, renderer) {
        const list = document.createDocumentFragment();
        list.append(...collection.map(renderer));
        return list;
    }

    renderView(view) {
        this._teardown();
        this.el.append(view.cloneNode(true));
    }

    prepend(child, parent) {
        if (parent === undefined) parent = this.el;
        else parent = this.el.querySelector(parent);
        parent.insertBefore(child.cloneNode(true), parent.firstChild);
        return child;
    }

    _teardown() {
        while (this.el.firstChild) {
            this.el.firstChild.remove();
        }
    }
}
