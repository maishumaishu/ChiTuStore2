import * as services from 'services';
import { Application, Page } from 'chitu.mobile';

class MyPage extends Page {
    constructor(params) {
        super(params);

        this.view('loading').innerHTML =
            `<div class="spin">
                <i class="icon-spinner icon-spin"></i>
            </div>`;
    }
}

let DEFAULT_HEADER = 'text!ui/headers/default.html';
let DEFAULT_WITH_BACK = 'text!ui/headers/defaultWithBack.html'
let LOAD_BY_NAME = 'LoadByName'
let MENU = 'text!ui/menu.html';
let config = {
    headerHeight: 50,
    footerHeight: 50,
    pageTitles: {
        'user.index': '用户中心',
        'user.login': '登录',
        'user.register': '商家注册',
        'user.resetPassword': '重置密码',
        'home.orders': '订单',
        'home.products': '商品'
    },
    headerPaths: {
        'home.index': DEFAULT_HEADER,
        'home.product': LOAD_BY_NAME,
        'user.register': DEFAULT_HEADER,
        'user.login': DEFAULT_HEADER,
        'user.resetPassword': DEFAULT_WITH_BACK
    },
    footerPaths: {
        'home.index': MENU,
        'home.orders': MENU,
        'home.products': MENU,
        'user.index': MENU,
    },
    css: {
        'user.login': LOAD_BY_NAME,
        'user.register': LOAD_BY_NAME,
        'home.products': LOAD_BY_NAME,
        'home.orders': LOAD_BY_NAME,
    },
    cachePages: ['home.products', 'home.orders', 'user.index']
}

class MyApplication extends chitu.Application {
    private headerText: string;


    constructor() {
        super();
        this.pageType = MyPage;
    }

    protected parseRouteString(routeString: string) {
        //outeString = routeString.replace(new RegExp('_'), '/');

        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');

        let headerPath = config.headerPaths[routeData.pageName];
        if (headerPath == LOAD_BY_NAME)
            headerPath = `text!ui/headers/Default.html`;
        else if (headerPath === undefined)
            headerPath = DEFAULT_WITH_BACK;

        let footerPath = config.footerPaths[routeData.pageName];

        if (headerPath)
            routeData.resources.push({ name: 'headerHTML', path: headerPath });

        if (footerPath)
            routeData.resources.push({ name: 'footerHTML', path: footerPath });

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = config.css[routeData.pageName];
        if (cssPath == LOAD_BY_NAME)
            cssPath = `css!content/app` + path;

        if (cssPath)
            routeData.resources.push({ name: 'pageCSS', path: cssPath });

        routeData.resources.push({ name: 'viewHTML', path: `text!pages${path}.html` });

        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;
        if (config.cachePages.indexOf(page.name) >= 0) {
            page.allowCache = true;
        }

        console.assert(page instanceof Page);
        page.load.add((sender, args) => {
            let { headerHTML, footerHTML } = args;
            console.assert(headerHTML != null);
            if (headerHTML) {
                let element = page.createHeader(config.headerHeight);
                element.innerHTML = headerHTML;
                let headerTitle = config.pageTitles[routeData.pageName];
                if (headerTitle) {
                    let titleElement = element.querySelector('h4');
                    console.assert(titleElement != null);
                    titleElement.innerHTML = headerTitle;
                }
            }
            if (footerHTML) {
                let element = page.createFooter(config.footerHeight);
                element.innerHTML = footerHTML;
            }
        });
        let className = routeData.pageName.split('.').join('-');
        page.element.className = 'page ' + className;

        return page;
    }
}

let app = window['app'] = new MyApplication();
app.run();

if (!location.hash) {
    app.redirect('home/index');
}

export = app;