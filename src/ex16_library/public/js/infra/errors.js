export class Errors {
    resJSON(res) {
        if (res.ok) return res.json();

        throw new Error('Something goes wrong!');
    }

    resRedirectJSON(res, path) {
        if (res.ok) return res.json();
        location.pathname = path;
    }
}
