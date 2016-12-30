import * as services from 'services';
import { Application, Page } from 'chitu.mobile';
import { config as imageBoxConfig } from 'controls/imageBox';
import * as chitu from 'chitu';
import Vue = require('vue');

export let config = {
    get imageText() {
        return imageBoxConfig.imageDisaplyText;
    },
    set imageText(value) {
        imageBoxConfig.imageDisaplyText = value;
    },
    defaultUrl: 'home_index'
}

var isCordovaApp = location.protocol === 'file:';
let isAndroid = navigator.userAgent.indexOf('Android') > -1;

class MyApplication extends Application {
    //private _cachePages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    private topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

    constructor() {
        super();
        this.pageType = Page;
        //this.topLevelPages = this._cachePages;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;

        this.buildHeader(page, 50);
        if (this.topLevelPages.indexOf(routeData.pageName) >= 0) {
            this.createMenu(page);
        }

        //if (this.topLevelPages.indexOf(routeData.pageName) >= 0) {
        //===================================================
        // IOS WEB 浏览器自带滑动返回
        page.allowSwipeBack = (isCordovaApp || isAndroid) && this.topLevelPages.indexOf(routeData.pageName) < 0;
        //===================================================
        //}

        this.buildLoadingView(page);
        if (routeData.pageName == 'home.product') {
            page.createFooter(50);
        }

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        requirejs([cssPath]);

        let className = routeData.pageName.split('.').join('-');
        page.element.className = 'page ' + className;
        //page.allowCache = this._cachePages.indexOf(page.name) >= 0;
        page.displayStatic = this.topLevelPages.indexOf(page.name) >= 0 || page.name == 'home.search';
        //=========================================
        // 在 shown 加入转动，而不是一开始加，避免闪烁
        page.shown.add((sender: Page) => {
            let i = sender.loadingView.querySelector('i') as HTMLElement;
            i.className = i.className + ' icon-spin';
        })
        //=========================================

        return page;
    }

    buildLoadingView(page: Page) {
        let h = createElement;
        let element = (
            <div class="spin">
                <i class="icon-spinner"></i>
            </div>
        );
        page.loadingView.appendChild(element);
    }

    buildHeader(page: Page, height: number) {
        let h = createElement;
        let defaultHeader = (
            <nav class="bg-primary" style="width:100%;">
                <h4>&nbsp;</h4>
            </nav>
        );
        let defaultHeaderWithBack = (
            <nav class="bg-primary" style="width:100%;">
                <a name="back-button" href="javascript:app.back()" class="leftButton">
                    <i class="icon-chevron-left"></i>
                </a>
                <h4>&nbsp;</h4>
            </nav>
        );
        let backColor: string;
        if (page.routeData.pageName == 'home.search') {
            backColor = '#fff';
        }
        let style = `height:${height}px`;
        if (backColor) {
            style = style + `background-color:${backColor}`;
        }
        let headerElement: HTMLElement = (
            <header style={style}>
                {
                    this.topLevelPages.indexOf(page.routeData.pageName) >= 0 ?
                        defaultHeader :
                        defaultHeaderWithBack
                }
            </header>
        );
        page.element.appendChild(headerElement);
    }

    createMenu(page: Page) {
        let routeData = page.routeData;
        let footerElement = page.createFooter(50);

        type ModelComputed = {
            itemsCount: () => number
        };
        type Model = ModelComputed;
        let vm = new Vue({
            el: footerElement,
            computed: ({
                itemsCount: services.shoppingCart.productsCount
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

function createElement(tagName: string, props, children: Array<HTMLElement | string>): HTMLElement {
    props = props || {};
    children = children || [];
    let element = document.createElement(tagName);
    for (let key in props) {
        if (key != 'attrs') {
            element.setAttribute(key, props[key]);
        }
        else {
            let attrs = props['attrs'];
            for (let name in attrs) {
                element.setAttribute(name, attrs[name]);
            }
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

export let app = window['app'] = new MyApplication();
app.run();
app.backFail.add(() => {
    app.redirect(config.defaultUrl);
});


if (!location.hash) {
    app.redirect(config.defaultUrl);
}

//================================================================================


