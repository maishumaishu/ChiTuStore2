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
    //private app: chitu.Application;
    private views: ViewClassName[] = ['main', 'loading', 'error'];
    private headerHeight = 0;
    private footerHeight = 0;
    private resize = chitu.Callbacks<Page, { headerHeight: number, footerHeight: number }>();

    private _viewCompleted: boolean = false;
    public displayStatic: boolean = false;
    public allowSwipeBack = false;

    constructor(params: chitu.PageParams) {
        super(params);

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
        this.element.insertBefore(headerElement, this.dataView);

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
    public pageShown = chitu.Callbacks<Application, chitu.Page>()

    constructor() {
        super();
        this.pageDisplayType = PageDisplayImplement;
        this.pageCreated.add((sender, page) => {
            this.pageShown.fire(this, page);
        })
    }



}

var touch_move_time: number = 0;
window.addEventListener('touchmove', function (e) {
    touch_move_time = Date.now();
})

var isiOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

function calculateAngle(x, y) {
    let d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
    return d;
}

class PageDisplayImplement implements chitu.PageDisplayer {
    private app: chitu.Application;
    private windowWidth: number;
    private previousPageStartX: number;

    constructor(app: chitu.Application) {
        this.app = app;
        this.windowWidth = window.innerWidth;
        this.previousPageStartX = 0 - this.windowWidth / 3;
    }


    private enableGesture(page: Page) {
        let startY, currentY;
        let startX, currentX;
        let moved = false;
        let SIDE_WIDTH = 20;
        let enable = false;

        let horizontal_swipe_angle = 35;
        let vertical_pull_angle = 65;
        let colse_position = window.innerWidth / 2;

        page.element.addEventListener('touchstart', function (event: TouchEvent) {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
            enable = startX <= SIDE_WIDTH
        })

        page.element.addEventListener('touchmove', (event: TouchEvent) => {
            currentX = event.targetTouches[0].pageX;
            currentY = event.targetTouches[0].pageY;
            //========================================
            // currentX < 0 表示 IOS 侧划
            if (isiOS && currentX < 0 || !enable) {
                return;
            }

            //========================================
            let deltaX = currentX - startX;
            let angle = calculateAngle(deltaX, currentY - startY);
            if (angle < horizontal_swipe_angle && deltaX > 0) {
                page.element.style.transform = `translate(${deltaX}px, 0px)`;
                page.element.style.transition = '0s';

                if (page.previous != null) {
                    page.previous.element.style.transform = `translate(${this.previousPageStartX + deltaX / 3}px, 0px)`;
                    page.previous.element.style.transition = '0s';
                }

                disableNativeScroll(page.element);
                moved = true;
                event.preventDefault();
                console.log('preventDefault gestured');
            }
        })


        let end = (event: TouchEvent) => {
            if (!moved)
                return;

            let deltaX = currentX - startX;
            if (deltaX > colse_position) {
                //page.close();
                this.app.back();
            }
            else {
                page.element.style.transform = `translate(0px, 0px)`;
                page.element.style.transition = '0.4s';

                if (page.previous) {
                    page.previous.element.style.transform = `translate(${this.previousPageStartX}px,0px)`;
                    page.previous.element.style.transition = `0.4s`;
                }
            }

            moved = false;
        }

        page.element.addEventListener('touchcancel', (event) => end(event));
        page.element.addEventListener('touchend', (event) => end(event));

        /** 禁用原生的滚动 */
        function disableNativeScroll(element: HTMLElement) {
            element.style.overflowY = 'hidden';
        }

        /** 启用原生的滚动 */
        function enableNativeScroll(element: HTMLElement) {
            element.style.overflowY = 'scroll';
        }

    }

    show(page: Page): Promise<any> {

        if (!(<any>page).gestured) {
            //this.disableOffset(page);
            (<any>page).gestured = true;
            if (page.allowSwipeBack)
                this.enableGesture(page);
        }

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
            page.element.style.transform = `translate(0px,0px)`;
            return Promise.resolve();
        }

        return new Promise(reslove => {
            page.element.style.transform = `translate(100%,0px)`;
            if (page.previous) {
                page.previous.element.style.transform = `translate(0px,0px)`;
            }
            //=======================================================
            // 必须 setTimeout 才有效果，哪怕延迟时间为 0
            window.setTimeout(() => {
                page.element.style.transform = `translate(0px,0px)`;
                page.element.style.transition = '0.4s';

                if (page.previous) {
                    page.previous.element.style.transform = `translate(${this.previousPageStartX}px,0px)`;
                    page.previous.element.style.transition = '0.4s';
                }

            }, 100)
            //=======================================================
            window.setTimeout(reslove, 1000);
        })
    }

    hide(page: Page) {
        //============================================
        // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过滑屏返回，
        // 通过滑屏返回，是不需要有返回效果的。
        if (isiOS && Date.now() - touch_move_time < 500 || page.displayStatic) {
            page.element.style.display = 'none';
            if (page.previous) {
                page.previous.element.style.removeProperty('transform');
                page.previous.element.style.removeProperty('transition');
            }
            return Promise.resolve();
        }
        //============================================

        page.element.style.transform = `translate(100%,0px)`;
        page.element.style.transition = '0.4s';

        if (page.previous) {
            //window.setTimeout(function () {
            page.previous.element.style.transform = `translate(0px, 0px)`;
            page.previous.element.style.transition = '0.4s';
            //}, 100);
        }

        return new Promise<any>(reslove => {
            window.setTimeout(function () {
                page.element.style.display = 'none';
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');

                // if (page.previous) {
                //     page.previous.element.style.removeProperty('transform');
                //     page.previous.element.style.removeProperty('transition');
                // }

                reslove();
            }, 500)
        });
    }
} 