define(["require", "exports", 'chitu'], function (require, exports, chitu) {
    "use strict";
    class Errors {
        static argumentNull(paramName) {
            let msg = `Argument '${paramName}' can not be null`;
            return new Error(msg);
        }
    }
    class Exception extends Error {
        constructor(...args) {
            super(...args);
            this.handled = false;
        }
    }
    class Page extends chitu.Page {
        constructor(params) {
            super(params);
            this.views = ['view', 'loading', 'error'];
            this.app = params.app;
            for (let className of ['header', 'footer'].concat(this.views)) {
                this.createChildElement(className);
            }
            this.showView('loading');
            this.load.add((sender, args) => {
                this.childElement('view').innerHTML = args.viewHTML || '';
            });
        }
        createChildElement(className) {
            let childElement = document.createElement('div');
            childElement.className = className;
            this.element.appendChild(childElement);
            return childElement;
        }
        showView(name) {
            for (let item of this.views) {
                if (name == item)
                    this.childElement(item).style.display = 'block';
                else
                    this.childElement(item).style.display = 'none';
            }
        }
        showError(err) {
            let element = this.childElement('error');
            console.assert(element != null);
            element.innerHTML = `<span>${err.message}</span>`;
            this.showView('error');
        }
        childElement(className) {
            let element = this.element.querySelector(`.${className}`);
            return element;
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
            let p = (callback(page) || Promise.resolve());
            p.then(() => {
                page.showView('view');
            }).catch((err) => {
                page.showError(err);
            });
        };
    }
    exports.action = action;
    ;
});
