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

class MyApplication extends chitu.Application {
    constructor() {
        super();
        this.pageType = MyPage;
    }

    protected parseRouteString(routeString: string) {
        let routeData = super.parseRouteString(routeString);

        let headerPath, footerPath;
        switch (routeData.pageName) {
            case 'Home.Index':
            case 'Home.Product':
                headerPath = `text!ui/headers/${routeData.pageName}.html`;
                break;
            default:
                headerPath = `text!ui/headers/DefaultWithBack.html`;
                break
        }

        switch (routeData.pageName) {
            case 'Home.Index':
                footerPath = `text!ui/Menu.html`;
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
            }
        });
        let className = routeData.pageName.split('.').join('-');
        //className = className + ' immersion';
        page.element.className = className;
        return page;
    }

    // private createHeader(pageElement: HTMLElement, headerHTML: string) {
    //     let headerElement = document.createElement('header');
    //     headerElement.innerHTML = headerHTML;
    //     pageElement.appendChild(headerElement);
    // }

}

export let app = window['app'] = new MyApplication();
app.run();

if (!location.hash) {
    app.redirect('home/index');
}

