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

type ViewName = 'view' | 'loading' | 'error';
type PageElementName = ViewName | 'header' | 'footer';
export class Page extends chitu.Page {
    private app: Application;
    private views: ViewName[] = ['view', 'loading', 'error'];

    constructor(params: chitu.PageParams) {
        super(params);

        this.app = params.app as Application;

        for (let className of ['header', 'footer'].concat(this.views)) {
            this.createChildElement(className);
        }

        this.showView('loading');
        this.load.add((sender: Page, args: any) => {
            this.childElement('view').innerHTML = args.viewHTML || '';
        });
    }

    private createChildElement(className: string) {
        let childElement = document.createElement('div');
        childElement.className = className;
        this.element.appendChild(childElement);
        return childElement;
    }

    showView(name: ViewName) {
        for (let item of this.views) {
            if (name == item)
                this.childElement(item).style.display = 'block';
            else
                this.childElement(item).style.display = 'none';
        }
    }

    showError(err: Error) {
        let element = this.childElement('error');
        console.assert(element != null);
        element.innerHTML = `<span>${err.message}</span>`;
        this.showView('error');
    }

    childElement(className: PageElementName) {
        let element = this.element.querySelector(`.${className}`) as HTMLElement;
        return element;
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
        routeData.resources.push({ name: 'viewHTML', path: `text!${routeData.actionPath}.html` });

        return routeData;
    }
}

type ActionCallback = ((page) => Promise<any> | void);
export function action(callback: ActionCallback) {
    return (page: Page) => {
        let p = (callback(page) || Promise.resolve()) as Promise<any>;
        p.then(() => {
            page.showView('view');
        }).catch((err: Error) => {
            page.showError(err);
        });
    };
};
