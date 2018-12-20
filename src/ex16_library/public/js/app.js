import { Model } from '/js/Model.js'
import { View } from '/js/View.js'
import { Controller } from '/js/Controller.js'

const model = new Model({ books: [], book: { server: {}, render: {} } });
const view = new View(model);
const controller = new Controller(model, view);

view.init();
