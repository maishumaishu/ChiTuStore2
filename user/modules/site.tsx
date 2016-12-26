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

let DEFAULT_HEADER_HTML = `
<nav class="bg-primary" style="width:100%;">
    <h4>&nbsp;</h4>
</nav>`;

let DEFAULT_HEADER_WITH_BACK_HTML = `
<nav class="bg-primary" style="width:100%;">
    <a name="back-button" href="javascript:app.back()" class="leftButton" style="padding-right:20px;padding-left:20px;margin-left:-20px;">
        <i class="icon-chevron-left"></i>
    </a>
    <h4>&nbsp;</h4>
</nav>`;

let LOADING_HTML = `
<div class="spin">
    <i class="icon-spinner"></i>
</div>`;

var isCordovaApp = location.protocol === 'file:';
let isAndroid = navigator.userAgent.indexOf('Android') > -1;

class MyApplication extends Application {
    private _cachePages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    private topLevelPages: Array<string>;

    constructor() {
        super();
        this.pageType = Page;
        this.topLevelPages = this._cachePages;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;

        let headerElement = page.createHeader(50);

        if (this.topLevelPages.indexOf(routeData.pageName) >= 0) {
            headerElement.innerHTML = DEFAULT_HEADER_HTML;
            let footerElement = page.createFooter(50);

            type ModelComputed = {
                itemsCount: () => number
            };
            type Model = ModelComputed;
            let vm = new Vue({
                el: footerElement,
                computed: ({
                    itemsCount: () => services.shoppingCart.store.state.itemsCount
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
        else {
            headerElement.innerHTML = DEFAULT_HEADER_WITH_BACK_HTML;
            //===================================================
            // IOS WEB 浏览器自带滑动返回
            page.allowSwipeBack = isCordovaApp || isAndroid;
            //===================================================
        }

        page.loadingView.innerHTML = LOADING_HTML;

        if (routeData.pageName == 'home.product') {
            page.createFooter(50);
        }

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        requirejs([cssPath]);

        let className = routeData.pageName.split('.').join('-');
        page.element.className = 'page ' + className;
        page.displayStatic = page.allowCache = this._cachePages.indexOf(page.name) >= 0;

        //=========================================
        // 在 shown 加入转动，而不是一开始加，避免闪烁
        page.shown.add((sender: Page) => {
            let i = sender.loadingView.querySelector('i') as HTMLElement;
            i.className = i.className + ' icon-spin';
        })
        //=========================================

        return page;
    }


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

export function createDefaultHeader(h, title: string) {

}
