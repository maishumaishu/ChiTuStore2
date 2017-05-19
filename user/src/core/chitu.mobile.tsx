import * as chitu from 'chitu';
/**
 * 说明：页面中元素的获取，都是实时 DOM 查询，而不是保存在一个变量中，是因为
 * 某些MVVM框架，可能会用到虚拟 DOM，把页面中的元素改写了。
 */

// export const viewTagName = 'SECTION';


export class Page extends chitu.Page {

    public displayStatic: boolean = false;
    public allowSwipeBackGestrue = false;
    public app: Application;

    constructor(params: chitu.PageParams) {
        super(params);
    }
}

export class Application extends chitu.Application {
    public pageShown = chitu.Callbacks<Application, { page: chitu.Page }>()

    constructor() {
        super();

        this.pageType = Page;

        if (isiOS)
            this.pageDisplayType = PageDisplayImplement;
        else
            this.pageDisplayType = LowMachinePageDisplayImplement;

    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData);
        //(page as Page).app = this;
        this.pageShown.fire(this, { page });

        return page;
    }

}

var touch_move_time: number = 0;
window.addEventListener('touchmove', function (e) {
    touch_move_time = Date.now();
})

var isiOS = (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || []).filter(o => o).length > 0; //ios终端

function calculateAngle(x, y) {
    let d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
    return d;
}

class PageDisplayImplement implements chitu.PageDisplayer {
    private app: chitu.Application;
    private windowWidth: number;
    private previousPageStartX: number;
    private animationTime = 400;

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
        let previousPageStartX = 0 - window.innerWidth / 3;

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
                    page.previous.element.style.transform = `translate(${previousPageStartX + deltaX / 3}px, 0px)`;
                    page.previous.element.style.transition = '0s';
                    page.previous.element.style.display = 'block';
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
                console.assert(this.app != null);
                this.app.back();
            }
            else {
                page.element.style.transform = `translate(0px, 0px)`;
                page.element.style.transition = '0.4s';

                if (page.previous) {
                    page.previous.element.style.transform = `translate(${previousPageStartX}px,0px)`;
                    page.previous.element.style.transition = `0.4s`;
                    window.setTimeout(function () {
                        page.previous.element.style.display = 'none';
                        page.previous.element.style.removeProperty('transform');
                        page.previous.element.style.removeProperty('transition');
                        page.element.style.removeProperty('transform');
                        page.element.style.removeProperty('transition');

                    }, 400);

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
        if (!(page as any).gestured) {
            (page as any).gestured = true;
            if (page.allowSwipeBackGestrue)
                this.enableGesture(page);
        }

        let maxZIndex = 1;
        let pageElements = document.getElementsByClassName('page');
        for (let i = 0; i < pageElements.length; i++) {
            let zIndex = new Number((pageElements.item(i) as HTMLElement).style.zIndex || '0').valueOf();
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        }

        page.element.style.zIndex = `${maxZIndex + 1}`;
        page.element.style.display = 'block';
        if (page.displayStatic) {
            if (page.previous) {
                page.previous.element.style.display = 'none';
            }
            return Promise.resolve();
        }

        page.element.style.transform = `translate(100%,0px)`;
        if (page.previous) {
            page.previous.element.style.transform = `translate(0px,0px)`;
            page.previous.element.style.transition = `${this.animationTime / 1000}s`;
        }

        return new Promise(reslove => {
            let delay = 100;
            window.setTimeout(() => {
                page.element.style.transform = `translate(0px,0px)`;
                page.element.style.transition = `${this.animationTime / 1000}s`;

                if (page.previous) {
                    page.previous.element.style.transform = `translate(${this.previousPageStartX}px,0px)`;
                    //==================================================================
                    // 由于距离短，时间可以延迟
                    page.previous.element.style.transition = `${(this.animationTime + 200) / 1000}s`;
                }

            }, delay);

            window.setTimeout(reslove, delay + this.animationTime)
        }).then(() => {
            page.element.style.removeProperty('transform');
            page.element.style.removeProperty('transition');
            if (page.previous) {
                page.previous.element.style.display = 'none';
                page.previous.element.style.removeProperty('transform');
                page.previous.element.style.removeProperty('transition');
            }
        })
    }

    hide(page: Page) {
        return new Promise<any>(reslove => {
            //============================================
            // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过系统浏览器滑屏返回，
            // 通过系统浏览器滑屏返回，是不需要有返回效果的。
            let now = Date.now();
            if (!isCordovaApp && isiOS && now - touch_move_time < 500 || page.displayStatic) {
                page.element.style.display = 'none';
                if (page.previous) {
                    page.previous.element.style.display = 'block';
                    page.previous.element.style.transition = `0s`;
                    page.previous.element.style.transform = 'translate(0,0)';
                }
                reslove();
                return;
            }
            //============================================

            page.element.style.transform = `translate(100%,0px)`;
            page.element.style.transition = `${this.animationTime / 1000}s`;

            if (page.previous) {
                page.previous.element.style.display = 'block';
                let delay = 0;
                if (!page.previous.element.style.transform) {
                    page.previous.element.style.transform = `translate(${this.previousPageStartX}px, 0px)`;
                    delay = 50;
                }

                window.setTimeout(() => {
                    page.previous.element.style.transform = `translate(0px, 0px)`;
                    page.previous.element.style.transition = `${(this.animationTime - delay) / 1000}s`;
                }, delay);
            }
            window.setTimeout(() => {
                page.element.style.display = 'none';
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');
                if (page.previous) {
                    page.previous.element.style.removeProperty('transform');
                    page.previous.element.style.removeProperty('transition');
                }
                reslove();

            }, 500)
        });
    }
}

class LowMachinePageDisplayImplement implements chitu.PageDisplayer {
    private app: chitu.Application;
    private windowWidth: number;

    constructor(app: chitu.Application) {
        this.app = app;
        this.windowWidth = window.innerWidth;
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
        let previousPageStartX = 0 - window.innerWidth / 3;

        page.element.addEventListener('touchstart', function (event: TouchEvent) {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
            enable = startX <= SIDE_WIDTH
            if (page.previous) {
                page.previous.element.style.display = 'block';
            }
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
                console.assert(this.app != null);
                this.app.back();
            }
            else {
                page.element.style.transform = `translate(0px, 0px)`;
                page.element.style.transition = '0.4s';
                setTimeout(() => {
                    if (page.previous) {
                        page.previous.element.style.display = 'none';
                    }
                }, 500);
            }

            setTimeout(() => {
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');

            }, 500);

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
        if (!(page as any).gestured) {
            (page as any).gestured = true;
            if (page.allowSwipeBackGestrue)
                this.enableGesture(page);
        }

        let maxZIndex = 1;
        let pageElements = document.getElementsByClassName('page');
        for (let i = 0; i < pageElements.length; i++) {
            let zIndex = new Number((pageElements.item(i) as HTMLElement).style.zIndex || '0').valueOf();
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        }

        page.element.style.zIndex = `${maxZIndex + 1}`;
        page.element.style.display = 'block';
        if (page.displayStatic) {
            if (page.previous) {
                page.previous.element.style.display = 'none';
            }
            return Promise.resolve();
        }

        page.element.style.transform = `translate(100%,0px)`;
        return new Promise(reslove => {
            const playTime = 500;
            let delay = 50;
            window.setTimeout(() => {
                page.element.style.transform = `translate(0px,0px)`;
                page.element.style.transition = `${playTime / 1000}s`;
            }, delay);

            window.setTimeout(reslove, delay + playTime)
        }).then(() => {
            page.element.style.removeProperty('transform');
            page.element.style.removeProperty('transition');
            if (page.previous) {
                page.previous.element.style.display = 'none';
            }
        })
    }

    hide(page: Page) {
        //============================================
        // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过滑屏返回，
        // 通过滑屏返回，是不需要有返回效果的。
        if (isiOS && Date.now() - touch_move_time < 500 || page.displayStatic) {
            page.element.style.display = 'none';
            if (page.previous) {
                page.previous.element.style.display = 'block';
                page.previous.element.style.removeProperty('transform');
                page.previous.element.style.removeProperty('transition');
            }
            return Promise.resolve();
        }
        //============================================

        page.element.style.transform = `translate(100%,0px)`;
        page.element.style.transition = '0.4s';

        if (page.previous) {
            page.previous.element.style.display = 'block';
        }

        return new Promise<any>(reslove => {
            window.setTimeout(function () {
                page.element.style.display = 'none';
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');

                reslove();

            }, 500)
        });
    }
}
