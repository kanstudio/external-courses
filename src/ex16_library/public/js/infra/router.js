const { history, location } = window;

const queueMicrotask = window.queueMicrotask || (f => Promise.resolve().then(f));

const WILDCARD = '*';
const ROOT = '/';

const REDIRECT = Symbol('redirect');
const ROUTE = Symbol('route');

const BEFORETRANSITION_EVENT = Symbol('beforetransition');
const AFTERTRANSITION_EVENT = Symbol('aftertransition');

const EVENT_NAMES = {
    'beforetransition': BEFORETRANSITION_EVENT,
    'aftertransition': AFTERTRANSITION_EVENT
};

const PATTERNS = {
    [WILDCARD]: '^.*$',
    [ROOT]: '^\\/$'
};

let COUNTER = 0;

export class Router {
    constructor(routes) {
        this.events = {
            [BEFORETRANSITION_EVENT]: [],
            [AFTERTRANSITION_EVENT]: []
        };
        this.routes = this._buildRoutes(routes);
        this.current = null;

        window.addEventListener('popstate', e => {
            e.preventDefault();
            const { href, id } = e.state;

            this._applyTransition(
                new URL(href),
                Object.values(this.routes).find(route => route.id === id),
                true
            );
        });

        document.addEventListener('click', e => {
            const link = e.target.nodeName === 'A'
                ? e.target
                : e.path ? e.path.find(element => element.nodeName === 'A') : '';

            if (link && link.href.includes(location.origin)) {
                e.preventDefault();
                e.stopImmediatePropagation();

                this.go(link.href);
            }
        });
        this.go(location.href, true);
    }

    _buildPattern(str) {
        switch (str) {
            case ROOT:
            case WILDCARD:
                return PATTERNS[str];

            default: {
                return `^\\${str.replace(/:(\w+)/g, (_, g) => '(\\w+)')}/?$`;
            }
        }
    }

    _buildParams(str) {
        switch (str) {
            case ROOT:
            case WILDCARD:
                return [];

            default: {
                return (str.match(/:(\w+)/g) || []).map(k => k.slice(1));
            }
        }
    }

    _buildRoutes(routesDef) {
        const routeBuilder = (routes, route) => {
            const params = this._buildParams(route);
            const r = this._buildPattern(route);
            const def = routesDef[route];
            def.path = route;

            routes[r] = {
                params,
                def,
                id: --COUNTER,
                link: null,
                matcher: new RegExp(r)
            };

            return routes;
        };

        const routes = Object.keys(routesDef).reduce(routeBuilder, {});

        return this._linkRedirects(routes);
    }

    _linkRedirects(routes) {
        const values = Object.values(routes);

        const redirects = values.filter(route => route.def.type === REDIRECT);

        redirects.forEach(route => {
            const target = values.find(target => target.def.path === route.def.to);

            if (!target) {
                throw new Error(
                    `Cannot link redirect from ${route.def.path} to ${route.def.path}`
                );
            }

            route.link = target;
        });

        return routes;
    }

    _findMatch(pathname) {
        const rs = Object.keys(this.routes);
        const matchIdx = rs.findIndex(r => pathname.match(r));

        if (matchIdx !== -1) {
            const route = this.routes[rs[matchIdx]];

            if (route.def.type === REDIRECT) {
                return {
                    url: new URL(`${location.origin}${route.def.to}`),
                    route: route.link
                };
            }

            return { url: new URL(`${location.origin}${pathname}`), route: route };
        }

        return null;
    }

    _extractParams(pathname, route) {
        const matchedGroups = pathname.match(route.matcher);

        return route.params.reduce((params, param, index) => {
            params[param] = matchedGroups[index + 1];

            return params;
        }, {});
    }

    _applyTransition(url, route, isReplace) {
        const params = route.params.length
            ? this._extractParams(url.pathname, route)
            : {};

        const args = { url, params };
        const data = { href: url.href, id: route.id };

        const handleState = isReplace ? history.replaceState : history.pushState;

        try {
            this.events[BEFORETRANSITION_EVENT].forEach(handler => handler());
        } catch (e) {
            console.log(e);
        }

        handleState.call(history, data, undefined, url.href);

        this.current = route;

        queueMicrotask(() => {
            try {
                route.def.callback(args);
            } catch (e) {
                console.log(e);
            }

            try {
                this.events[AFTERTRANSITION_EVENT].forEach(handler => handler());
            } catch (e) {
                console.log(e);
            }
        });
    }

    addEventListener(event, handler) {
        this.events[EVENT_NAMES[event]].push(handler);
    }

    forward() {
        history.forward();
    }

    back() {
        history.back();
    }

    go(href, isReplace = false) {
        const temp = new URL(href);

        const { url, route } = this._findMatch(temp.pathname);
        if (route === this.current) {
            return;
        }

        if (route === null) {
            throw new ErrorEvent(`Cannot find route handler for ${temp.pathname}`);
        }

        this._applyTransition(url, route, isReplace);
    }
};

Router.redirect = to => ({ type: REDIRECT, to });
Router.route = callback => ({ type: ROUTE, callback });
