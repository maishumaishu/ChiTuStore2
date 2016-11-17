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
            this.app = params.app;
            let header = this.createChildElement('header');
            let view = this.createChildElement('view');
            let loading = this.createChildElement('loading');
            let error = this.createChildElement('error');
            let footer = this.createChildElement('footer');
            error.appendChild(document.createElement('span'));
            this.elements = { header: header, loading: loading, view: view, error: error, footer: footer };
            this.showElement('loading');
            this.load.add((sender, html) => {
                this.elements.view.innerHTML = html;
            });
        }
        createChildElement(className) {
            let childElement = document.createElement('div');
            childElement.className = className;
            this.element.appendChild(childElement);
            childElement.style.display = 'none';
            return childElement;
        }
        showElement(name) {
            for (let key in this.elements) {
                this.elements[key].style.display = key == name ? 'block' : 'none';
            }
        }
        showError(err) {
            this.elements.error.querySelector('span').innerHTML = err.message;
            this.showElement('error');
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
            routeData.resource = [
                `text!${routeData.actionPath}.html`,
            ];
            return routeData;
        }
    }
    exports.Application = Application;
    function action(callback) {
        return (page) => {
            let p = (callback(page) || Promise.resolve());
            p.then(() => {
                page.showElement('view');
            }).catch((err) => {
                page.showError(err);
            });
        };
    }
    exports.action = action;
    ;
});
