export class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(ev, listener) {
        (this._events[ev] || (this._events[ev] = [])).push(listener);
        return this;
    }
    emit(ev, arg) {
        (this._events[ev] || []).slice().forEach(lsn => lsn(arg));
    }
}
