import { Service, ShoppingCartService, AjaxError } from 'services';
import { Application as BaseApplication, Page as BasePage } from 'chitu.mobile';
import { config as imageBoxConfig } from 'controls/imageBox';
import * as chitu from 'chitu';
import Vue = require('vue');

/** 是否为 APP */
var isCordovaApp = location.protocol === 'file:';
/** 是否为安卓系统 */
let isAndroid = navigator.userAgent.indexOf('Android') > -1;
/** 是否允浸入式头 */
let allowImmersionHeader = false;
let topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

if (isCordovaApp && !isAndroid) {
    allowImmersionHeader = true;
}

export let config = {
    get imageText() {
        return imageBoxConfig.imageDisaplyText;
    },
    set imageText(value) {
        imageBoxConfig.imageDisaplyText = value;
    },
    defaultUrl: 'home_index'
}

export class Page extends BasePage {
    constructor(params) {
        super(params);

        this.buildErrorView();
        this.buildLoadingView();
        this.buildHeader(50);
        if (topLevelPages.indexOf(this.routeData.pageName) >= 0) {
            this.createMenu();
        }
        if (this.routeData.pageName == 'home.product') {
            this.createFooter(50);
        }


        let className = this.routeData.pageName.split('.').join('-');
        this.element.className = (allowImmersionHeader ? 'page immersion ' : 'page ') + className;
        this.displayStatic = topLevelPages.indexOf(this.name) >= 0 || this.name == 'home.search';

        //=========================================
        // 在 shown 加入转动，而不是一开始加，避免闪烁
        this.shown.add((sender: Page, args) => {
            let i = sender.loadingView.querySelector('i') as HTMLElement;
            i.className = i.className + ' icon-spin';
        })
        //=========================================

        //===================================================
        // IOS WEB 浏览器自带滑动返回
        this.allowSwipeBackGestrue = (isCordovaApp || isAndroid) && topLevelPages.indexOf(this.routeData.pageName) < 0;
        //===================================================readonly

    }

    reload() {
        this.errorView.style.display = 'none';
        this.loadingView.style.display = 'block';
        let result = super.reload();
        return result;
    }

    createService<T extends Service>(serviceType: { new (): T }): T {
        let result = new serviceType();
        result.error.add((sender, error) => {
            this.showError(error);
        })
        return result;
    }

    /** 判断主视图是否为活动状态 */
    private dataViewIsActive() {

        // 选取主视图后面的视图，如果有显示的，则说明为非活动状态
        let views = this.element.querySelectorAll('section[class="main"] + section');
        for (let i = 0; i < views.length; i++) {
            let view = views[i] as HTMLElement;
            let display = !view.style.display || view.style.display == 'block';
            if (display)
                return false;
        }

        return true;
    }

    private showError(err: Error) {
        let method: string;
        let display = this.loadingView.style.display || 'block';
        if (this.dataViewIsActive()) {
            alert(err.message);
            console.log(err);
        }
        else {
            let element = this.view('error').querySelector('.text') as HTMLElement;
            console.assert(element != null);
            element.innerHTML = err.message;

            this.errorView.style.display = 'block'
        }
    }

    private buildErrorView() {
        let h = createElement;
        let page = this;
        let element = (
            <div class="norecords">
                <div class="icon">
                    <i class="icon-rss">
                    </i>
                </div>
                <h4 class="text"></h4>
                <button onclick={() => this.reload()} class="btn btn-default" style="margin-top:10px;">点击重新加载页面</button>
            </div>
        );
        this.errorView.appendChild(element);
    }

    private buildLoadingView() {
        let h = createElement;
        let element = (
            <div class="spin">
                <i class="icon-spinner"></i>
            </div>
        );
        this.loadingView.appendChild(element);
    }

    private buildHeader(height: number) {
        let h = createElement;

        let headerStyle = {} as CSSStyleDeclaration;
        if (this.routeData.pageName == 'home.search') {
            headerStyle.backgroundColor = '#fff';
        }


        let isTopPage = topLevelPages.indexOf(this.routeData.pageName) >= 0;
        let noneHeaderPages = ['user.index'];
        let headerElement: HTMLElement = (
            <header style={headerStyle}>
                {
                    <nav class="bg-primary" style={headerStyle}>
                        {isTopPage ?
                            <span></span> :
                            <button name="back-button" onclick={() => app.back()} class="leftButton">
                                <i class="icon-chevron-left"></i>
                            </button>
                        }
                        <h4>&nbsp;</h4>
                    </nav>
                }
            </header>
        );

        if (noneHeaderPages.indexOf(this.routeData.pageName) < 0) {
            this.element.appendChild(headerElement);
        }
    }

    private createMenu() {
        let page = this;
        let shoppingCart = page.createService(ShoppingCartService);
        let routeData = page.routeData;
        let footerElement = page.createFooter(50);

        type ModelComputed = {
            itemsCount: () => number
        };
        type Model = ModelComputed;
        let vm = new Vue({
            el: footerElement,
            computed: ({
                itemsCount: shoppingCart.productsCount
            } as ModelComputed),
            mounted() {
                let self = this as VueInstance<any>;
                var activeElement = self.$el.querySelector(`[name="${routeData.pageName}"]`) as HTMLElement;
                if (activeElement) {
                    activeElement.className = 'active';
                }
            },
            render(h) {
                let model = this as Model;
                return (
                    <footer>
                        <ul class="menu" style="margin-bottom:0px;">
                            <li>
                                <a name="home.index" href="#home_index">
                                    <i class="icon-home"></i>
                                    <span>首页</span>
                                </a>
                            </li>
                            <li>
                                <a name="home.class" href="#home_class">
                                    <i class="icon-th-large"></i>
                                    <span>分类</span>
                                </a>
                            </li>
                            <li>
                                <a name="shopping.shoppingCart" href="#shopping_shoppingCart">
                                    <i class="icon-shopping-cart"></i>
                                    <sub name="products-count" style={{ display: model.itemsCount ? 'block' : 'none' }} class="sub" domProps-innerHTML={model.itemsCount}></sub>
                                    <span>购物车</span>
                                </a>

                            </li>
                            <li>
                                <a name="home.newsList" href="#home_newsList">
                                    <i class="icon-rss"></i>
                                    <span>微资讯</span>
                                </a>
                            </li>
                            <li>
                                <a name="user.index" href="#user_index">
                                    <i class="icon-user"></i>
                                    <span>我</span>
                                </a>
                            </li>
                        </ul>
                    </footer>
                )
            }
        })
    }

}

export class Application extends BaseApplication {
    private topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    constructor() {
        super();
        this.pageType = Page;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        requirejs([cssPath]);

        return page;
    }



}

function createElement(tagName: string, props, children: Array<HTMLElement | string>): HTMLElement {
    props = props || {};
    children = children || [];
    let element = document.createElement(tagName) as HTMLElement;
    for (let key in props) {
        // if(key.startsWith('on')){
        //     element[key] = props[key];
        //     continue;
        // }
        switch (key) {
            case 'attrs':
                let attrs = props['attrs'];
                for (let name in attrs) {
                    if (name.startsWith('on')) {
                        element[name] = attrs[name];
                        continue;
                    }
                    element.setAttribute(name, attrs[name]);
                }
                break;
            case 'style':
                let styleValue = props[key];
                if (typeof (styleValue) == 'string') {
                    element.setAttribute('style', styleValue);
                }
                else {
                    let names = Object.getOwnPropertyNames(styleValue)
                    for (let i = 0; i < names.length; i++) {
                        let name = names[i];
                        element.style[name] = styleValue[name];
                    }
                }
                break;
            default:
                element.setAttribute(key, props[key]);
                break;
        }

    }
    for (let i = 0; i < children.length; i++) {
        if (typeof (children[i]) == 'string') {
            element.innerHTML = children[i] as string;
        }
        else {
            element.appendChild(children[i] as HTMLElement);
        }
    }
    return element;
}

export let app = window['app'] = new Application();
app.run();
app.backFail.add(() => {
    app.redirect(config.defaultUrl);
});


if (!location.hash) {
    app.redirect(config.defaultUrl);
}

//================================================================================


export function defaultTitleBar(h: Function, title?: string) {
    title = title || '&nbsp';
    return (
        <nav class="bg-primary">
            <button name="back-button" onclick={() => app.back()} class="leftButton">
                <i class="icon-chevron-left"></i>
            </button>
            <h4 domProps-innerHTML={title}></h4>
        </nav>
    );
}

