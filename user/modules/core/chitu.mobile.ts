import fetch = require('fetch');
import * as chitu from 'chitu';

class Errors {
    static argumentNull(paramName: string) {
        let msg = `Argument '${paramName}' can not be null`;
        return new Error(msg);
    }
    static headerExists(pageName: string) {
        let msg = `Header is exists in '${pageName}'.`;
        return new Error(msg);
    }
    static footerExists(pageName: string) {
        let msg = `Header is exists in '${pageName}'.`;
        return new Error(msg);
    }
}

class Exception extends Error {
    handled: boolean = false;
}

/**
 * 说明：页面中元素的获取，都是实时 DOM 查询，而不是保存在一个变量中，是因为
 * 某些MVVM框架，可能会用到虚拟 DOM，把页面中的元素改写了。
 */
const headerTagName = 'header';
const footerTagName = 'footer';
const viewTagName = 'section';

type ViewClassName = 'main' | 'loading' | 'error';
export class Page extends chitu.Page {
    private app: Application;
    private views: ViewClassName[] = ['main', 'loading', 'error'];
    private headerHeight = 0;
    private footerHeight = 0;
    private resize = chitu.Callbacks<Page, { headerHeight: number, footerHeight: number }>();
    private _viewCompleted: boolean = false;

    constructor(params: chitu.PageParams) {
        super(params);

        this.app = params.app as Application;

        for (let className of this.views) {
            this.createView(className);
        }

        this.view('error').style.display = 'none';

        this.load.add((sender: Page, args: any) => {
            this._viewCompleted = true;
            this.view('main').innerHTML = args.viewHTML || '';
        });
    }

    private createView(className: string) {
        let childElement = document.createElement(viewTagName);
        childElement.className = className;
        this.element.appendChild(childElement);
        return childElement;
    }

    showError(err: Error) {
        let element = this.view('error');
        console.assert(element != null);
        element.innerHTML = `<span>${err.message}</span>`;
        element.style.display = 'block';
    }

    protected view(className: ViewClassName) {
        let element = this.element.querySelector(`.${className}`) as HTMLElement;
        return element;
    }

    get dataView() {
        return this.view('main');
    }

    get loadingView() {
        return this.view('loading');
    }

    get header(): HTMLElement {
        return this.element.querySelector(headerTagName) as HTMLElement;
    }

    get footer(): HTMLElement {
        return this.element.querySelector(footerTagName) as HTMLElement;
    }

    get viewCompleted(): boolean {
        return this._viewCompleted;
    }

    createHeader(headerHeight: number): HTMLElement {
        if (this.header != null)
            throw Errors.headerExists(this.routeData.pageName);

        let headerElement = document.createElement(headerTagName);
        this.headerHeight = headerHeight;
        headerElement.style.height = headerHeight + 'px';
        this.element.appendChild(headerElement);
        this.resize.fire(this, { headerHeight, footerHeight: this.footerHeight });
        return headerElement;
    }

    createFooter(footerHeight: number): HTMLElement {
        if (this.footer != null)
            throw Errors.footerExists(this.routeData.pageName);

        let footerElement = document.createElement('footer');
        footerElement.style.height = footerHeight + 'px';
        this.element.appendChild(footerElement);
        this.resize.fire(this, { headerHeight: this.headerHeight, footerHeight });
        return footerElement;
    }
}

export class Application extends chitu.Application {

    error = chitu.Callbacks();

    constructor() {
        super();
        super.pageType = Page;
    }

    protected parseRouteString(routeString: string) {
        routeString = routeString.replace(new RegExp('_'), '/');
        let routeData = super.parseRouteString(routeString);
        routeData.resources.push({ name: 'viewHTML', path: `text!${routeData.actionPath}.html` });

        return routeData;
    }
}

type ActionCallback = ((page: Page) => Promise<any> | void);
export function action(callback: ActionCallback) {
    return (page: Page) => {

        let result = callback(page) as Promise<any>;
            if (result == null)
                result = Promise.resolve();

        page.load.add(() => {
            result.then(() => page.loadingView.style.display = 'none');
        });

    };
};
