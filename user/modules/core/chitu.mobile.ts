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
    private app: chitu.Application;
    private views: ViewClassName[] = ['main', 'loading', 'error'];
    private headerHeight = 0;
    private footerHeight = 0;
    private resize = chitu.Callbacks<Page, { headerHeight: number, footerHeight: number }>();
    private _viewCompleted: boolean = false;
    public displayStatic: boolean = false;

    constructor(params: chitu.PageParams) {
        super(params);

        this.app = params.app as chitu.Application;
        //super.dis
        for (let className of this.views) {
            this.createView(className);
        }

        this.view('error').style.display = 'none';

        this.load.add((sender: Page, args: any) => {
            this._viewCompleted = true;
            if (args.viewHTML)
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

        return headerElement;
    }

    createFooter(footerHeight: number): HTMLElement {
        if (this.footer != null)
            throw Errors.footerExists(this.routeData.pageName);

        let footerElement = document.createElement('footer');
        footerElement.style.height = footerHeight + 'px';
        this.element.appendChild(footerElement);

        return footerElement;
    }
}

export class Application extends chitu.Application {
    constructor() {
        super();
        this.pageDisplayType = PageDisplayImplement;
    }

}

var touch_move_time: number = 0;
window.addEventListener('touchmove', function (e) {
    touch_move_time = Date.now();
})

var isiOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

class PageDisplayImplement implements chitu.PageDisplayer {
    show(page: Page): Promise<any> {


        let maxZIndex = 1;
        let pageElements = document.getElementsByClassName('page');
        for (let i = 0; i < pageElements.length; i++) {
            let zIndex = new Number((<HTMLElement>pageElements.item(i)).style.zIndex || '0').valueOf();
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        }

        page.element.style.zIndex = `${maxZIndex + 1}`;
        page.element.style.display = 'block';
        if (page.displayStatic) {
            return Promise.resolve();
        }

        page.element.style.transform = `translate(100%,0px)`;
        window.setTimeout(function () {
            page.element.style.transform = `translate(0px,0px)`;
            page.element.style.transition = '0.4s';
        }, 100)

        return new Promise<any>(reslove => {
            window.setTimeout(function () {
                reslove();
            }, 1000)
        });
    }
    hide(page: Page) {
        if (page.displayStatic) {
            page.element.style.display = 'none';
            return Promise.resolve();
        }

        //============================================
        // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过滑屏返回，
        // 通过滑屏返回，是不需要有返回效果的。
        if (isiOS && Date.now() - touch_move_time < 500) {
            page.element.style.display = 'none';
            return Promise.resolve();
        }
        //============================================


        page.element.style.transform = `translate(100%,0px)`;
        page.element.style.transition = '0.4s';

        return new Promise<any>(reslove => {
            window.setTimeout(function () {
                page.element.style.display = 'none';
                reslove();
            }, 1000)
        });
    }
} 