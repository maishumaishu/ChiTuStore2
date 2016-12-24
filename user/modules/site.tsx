import * as services from 'services';
import { Application, Page } from 'chitu.mobile';
import { config as imageBoxConfig } from 'controls/imageBox';
import * as chitu from 'chitu';

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
            requirejs([`text!ui/menu.html`], function (footerHTML) {
                let footerElement = page.createFooter(50);
                footerElement.innerHTML = footerHTML;
                var activeElement = footerElement.querySelector(`[name="${routeData.pageName}"]`) as HTMLElement;
                if (activeElement) {
                    activeElement.className = 'active';
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
