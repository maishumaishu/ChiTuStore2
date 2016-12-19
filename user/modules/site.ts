import * as services from 'services';
import { Application, Page } from 'chitu.mobile';

export let config = {
    imageText: '零食有约'
}

class MyPage extends Page {
    constructor(params) {
        super(params);

        this.view('loading').innerHTML =
            `<div class="spin">
    <i class="icon-spinner icon-spin"></i>
</div>`;
    }
}

class MyApplication extends chitu.Application {
    constructor() {
        super();
        this.pageType = MyPage;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');

        let headerPath, footerPath;
        switch (routeData.pageName) {
            case 'home.index':
            case 'home.product':
                headerPath = `text!ui/headers/${routeData.pageName}.html`;
                break;
            case 'home.class':
            case 'home.newsList':
            case 'shopping.shoppingCart':
            case 'user.index':
                headerPath = `text!ui/headers/default.html`;
                break;
            default:
                headerPath = `text!ui/headers/defaultWithBack.html`;
                break
        }

        switch (routeData.pageName) {
            case 'home.index':
            case 'home.newsList':
            case 'home.class':
            case 'shopping.shoppingCart':
            case 'user.index':
                footerPath = `text!ui/menu.html`;
                break;
        }

        if (headerPath)
            routeData.resources.push({ name: 'headerHTML', path: headerPath });

        if (footerPath)
            routeData.resources.push({ name: 'footerHTML', path: footerPath });

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        routeData.resources.push({ name: 'pageCSS', path: cssPath });
        routeData.resources.push({ name: 'viewHTML', path: `text!pages${path}.html` });

        if (routeData.pageName == 'home.newsList') {
            routeData.resources.push({ name: 'dataList', path: `controls/dataList` });
        }

        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;
        console.assert(page instanceof Page);
        page.load.add((sender, args) => {
            let { headerHTML, footerHTML } = args;
            console.assert(headerHTML != null);
            if (headerHTML) {
                let element = page.createHeader(50);
                element.innerHTML = headerHTML;
            }
            if (footerHTML) {
                let element = page.createFooter(50);
                element.innerHTML = footerHTML;
                var activeElement = element.querySelector(`[name="${routeData.pageName}"]`) as HTMLElement;
                if (activeElement) {
                    activeElement.className = 'active';
                }
            }
        });
        let className = routeData.pageName.split('.').join('-');
        page.element.className = 'page ' + className;
        return page;
    }
}

export let app = window['app'] = new MyApplication();
app.run();

var u = navigator.userAgent;
export let isAndroid = u.indexOf('Android') > -1;

if (!location.hash) {
    app.redirect('home_index');
}

