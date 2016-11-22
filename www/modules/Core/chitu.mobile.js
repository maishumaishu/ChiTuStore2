define(["require", "exports", 'chitu'], function (require, exports, chitu) {
    "use strict";
    class Errors {
        static argumentNull(paramName) {
            let msg = `Argument '${paramName}' can not be null`;
            return new Error(msg);
        }
        static headerExists(pageName) {
            let msg = `Header is exists in '${pageName}'.`;
            return new Error(msg);
        }
        static footerExists(pageName) {
            let msg = `Header is exists in '${pageName}'.`;
            return new Error(msg);
        }
    }
    class Exception extends Error {
        constructor(...args) {
            super(...args);
            this.handled = false;
        }
    }
    const headerTagName = 'header';
    const footerTagName = 'footer';
    const viewTagName = 'section';
    class Page extends chitu.Page {
        constructor(params) {
            super(params);
            this.views = ['main', 'loading', 'error'];
            this.headerHeight = 0;
            this.footerHeight = 0;
            this.resize = chitu.Callbacks();
            this._viewCompleted = false;
            this.app = params.app;
            for (let className of this.views) {
                this.createView(className);
            }
            this.showView('loading');
            this.load.add((sender, args) => {
                this._viewCompleted = true;
                this.view('main').innerHTML = args.viewHTML || '';
            });
            this.resize.add((sender, args) => {
                let elements = this.element.querySelectorAll(viewTagName);
                for (let i = 0; i < elements.length; i++) {
                    let element = elements.item(i);
                    let h = window.innerHeight - args.headerHeight - args.footerHeight;
                    element.style.height = h + 'px';
                    element.style.top = args.headerHeight + 'px';
                }
            });
            window.addEventListener('resize', () => {
                this.resize.fire(this, { headerHeight: this.headerHeight, footerHeight: this.footerHeight });
            });
        }
        createView(className) {
            let childElement = document.createElement(viewTagName);
            childElement.className = className;
            this.element.appendChild(childElement);
            return childElement;
        }
        showView(name) {
            for (let item of this.views) {
                if (name == item)
                    this.view(item).style.display = 'block';
                else
                    this.view(item).style.display = 'none';
            }
        }
        showError(err) {
            let element = this.view('error');
            console.assert(element != null);
            element.innerHTML = `<span>${err.message}</span>`;
            this.showView('error');
        }
        view(className) {
            let element = this.element.querySelector(`.${className}`);
            return element;
        }
        get mainView() {
            return this.view('main');
        }
        get header() {
            return this.element.querySelector(headerTagName);
        }
        get footer() {
            return this.element.querySelector(footerTagName);
        }
        get viewCompleted() {
            return this._viewCompleted;
        }
        createHeader(headerHeight) {
            if (this.header != null)
                throw Errors.headerExists(this.routeData.pageName);
            let headerElement = document.createElement(headerTagName);
            this.headerHeight = headerHeight;
            headerElement.style.height = headerHeight + 'px';
            this.element.appendChild(headerElement);
            this.resize.fire(this, { headerHeight: headerHeight, footerHeight: this.footerHeight });
            return headerElement;
        }
        createFooter(footerHeight) {
            if (this.footer != null)
                throw Errors.footerExists(this.routeData.pageName);
            let footerElement = document.createElement('footer');
            footerElement.style.height = footerHeight + 'px';
            this.element.appendChild(footerElement);
            this.resize.fire(this, { headerHeight: this.headerHeight, footerHeight: footerHeight });
            return footerElement;
        }
    }
    exports.Page = Page;
    class Application extends chitu.Application {
        constructor() {
            super();
            this.error = chitu.Callbacks();
            super.pageType = Page;
        }
        parseRouteString(routeString) {
            let routeData = super.parseRouteString(routeString);
            routeData.resources.push({ name: 'viewHTML', path: `text!${routeData.actionPath}.html` });
            return routeData;
        }
    }
    exports.Application = Application;
    function action(callback) {
        return (page) => {
            let pageLoadPromise = new Promise((reslove, reject) => {
                if (page.viewCompleted)
                    reslove();
                page.load.add(() => reslove());
            });
            let p = (callback(page, pageLoadPromise) || Promise.resolve());
            p.then(() => {
                window.setTimeout(function () {
                    page.showView('main');
                }, 10);
            }).catch((err) => {
                page.showError(err);
            });
        };
    }
    exports.action = action;
    ;
});
