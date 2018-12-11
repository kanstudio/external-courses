const parser = new DOMParser();

class Template {
    constructor(el) {
        this.clone = () => el.cloneNode(true);
    }

    render(data) {
        const el = this.clone();

        for (let slot of el.querySelectorAll('[tpl\\:attr]')) {
            const [attr, prop] = slot.getAttribute('tpl:attr').split(':');

            slot.setAttribute(attr, data[prop]);
        }

        for (let slot of el.querySelectorAll('[tpl\\:content]')) {
            const prop = slot.getAttribute('tpl:content');

            slot.textContent = data[prop];
        }

        return el;
    }
}

export function html(str, ...vals) {
    let markup;

    if (str.length > 1) {
        markup = vals.reduce((data, val, idx) => {
            data.push(val);
            data.push(str[idx + 1]);

            return data;
        }, [str[0]]).join('').trim();
    } else {
        markup = str[0].trim();

        if (vals.length) {
            let placeholder;
            for (let i = 0; i < vals.length; i++) {
                for (let prop in vals[i]) {
                    const content = vals[i][prop] ? vals[i][prop] : '';
                    placeholder = new RegExp('\{\{' + prop + '\}\}', 'g');
                    markup = markup.replace(placeholder, content);
                }
            }
        }
    }

    const document = parser.parseFromString(markup, 'text/html');
    const tpl = document.getElementsByTagName('template')[0].content.cloneNode(true);
    return new Template(tpl);
}
