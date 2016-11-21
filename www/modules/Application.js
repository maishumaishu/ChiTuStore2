define(["require", "exports", 'chitu.mobile'], function (require, exports, chitu_mobile_1) {
    "use strict";
    class MyPage extends chitu_mobile_1.Page {
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
        parseRouteString(routeString) {
            let routeData = super.parseRouteString(routeString);
            let headerPath, footerPath;
            switch (routeData.pageName) {
                case 'Home.Index':
                case 'Home.Product':
                    headerPath = `text!ui/headers/${routeData.pageName}.html`;
                    break;
                default:
                    headerPath = `text!ui/headers/DefaultWithBack.html`;
                    break;
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
        createPage(routeData) {
            let page = super.createPage(routeData);
            console.assert(page instanceof chitu_mobile_1.Page);
            page.load.add((sender, args) => {
                let { headerHTML, footerHTML } = args;
                console.assert(headerHTML != null);
                if (headerHTML) {
                    let element = page.createHeader(65);
                    element.innerHTML = headerHTML;
                }
                if (footerHTML) {
                    let element = page.createFooter(50);
                    element.innerHTML = footerHTML;
                }
            });
            let className = routeData.pageName.split('.').join('-');
            className = className + ' immersion';
            page.element.className = className;
            return page;
        }
    }
    exports.app = window['app'] = new MyApplication();
    exports.app.run();
    if (!location.hash) {
        exports.app.redirect('home/index');
    }
});
