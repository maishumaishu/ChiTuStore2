import fetch = require('fetch');
import * as chitu from 'chitu';

class Errors {
    static argumentNull(paramName: string) {
        let msg = `Argument '${paramName}' can not be null`;
        return new Error(msg);
    }
}

class Exception extends Error {
    handled: boolean = false;
}

export class Page extends chitu.Page {
    private app: Application;
    elements: {
        header: HTMLElement, loading: HTMLElement, view: HTMLElement,
        error: HTMLElement, footer: HTMLElement
    };
    constructor(params: chitu.PageParams) {
        super(params);

        this.app = params.app as Application;

        let header = this.createChildElement('header');
        let view = this.createChildElement('view');
        let loading = this.createChildElement('loading');
        let error = this.createChildElement('error');
        let footer = this.createChildElement('footer');

        error.appendChild(document.createElement('span'));

        this.elements = { header, loading, view, error, footer };
        this.showElement('loading');

        this.load.add((sender: Page, html: string) => {
            this.elements.view.innerHTML = html;
        });
    }

    private createChildElement(className: string) {
        let childElement = document.createElement('div');
        childElement.className = className;
        this.element.appendChild(childElement);
        childElement.style.display = 'none';
        return childElement;
    }

    showElement(name: 'loading' | 'view' | 'error') {
        for (let key in this.elements) {
            (this.elements[key] as HTMLElement).style.display = key == name ? 'block' : 'none';
        }
    }

    showError(err: Error) {
        this.elements.error.querySelector('span').innerHTML = err.message;
        this.showElement('error');
    }
}

export class Application extends chitu.Application {

    error = chitu.Callbacks();

    constructor() {
        super();
        super.pageType = Page;
    }

    protected parseRouteString(routeString: string) {
        let routeData = super.parseRouteString(routeString);
        routeData.resource = [
            `text!${routeData.actionPath}.html`,
        ];
        return routeData;
    }
}

type ActionCallback = ((page) => Promise<any> | void);
export function action(callback: ActionCallback) {
    return (page: Page) => {
        let p = (callback(page) || Promise.resolve()) as Promise<any>;
        p.then(() => {
            page.showElement('view');
        }).catch((err: Error) => {
            page.showError(err);
        });
    };
};
