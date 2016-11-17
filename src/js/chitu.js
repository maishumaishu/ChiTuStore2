(function(factory) { 
                if (typeof define === 'function' && define['amd']) { 
                    define(factory);  
                } else { 
                    factory(); 
                } 
            })(function() {var chitu;
(function (chitu) {
    const DEFAULT_FILE_BASE_PATH = 'modules';
    class RouteParser {
        constructor(basePath) {
            this.path_string = '';
            this.path_spliter_char = '/';
            this.param_spliter = '?';
            this.name_spliter_char = '.';
            this._actionPath = '';
            this._cssPath = '';
            this._parameters = {};
            this._pageName = '';
            this._pathBase = '';
            this.HASH_MINI_LENGTH = 2;
            this._pathBase = basePath || '';
        }
        parseRouteString(routeString) {
            let routePath;
            let search;
            let param_spliter_index = routeString.indexOf(this.param_spliter);
            if (param_spliter_index > 0) {
                search = routeString.substr(param_spliter_index + 1);
                routePath = routeString.substring(0, param_spliter_index);
            }
            else {
                routePath = routeString;
            }
            if (!routePath)
                throw chitu.Errors.canntParseRouteString(routeString);
            if (search) {
                this._parameters = this.pareeUrlQuery(search);
            }
            let path_parts = routePath.split(this.path_spliter_char).map(o => o.trim()).filter(o => o != '');
            if (path_parts.length < 1) {
                throw chitu.Errors.canntParseRouteString(routeString);
            }
            let file_path = path_parts.join(this.path_spliter_char);
            let page_name = path_parts.join(this.name_spliter_char);
            var result = {
                actionPath: (this.basePath ? chitu.combinePath(this.basePath, file_path) : file_path),
                values: this._parameters,
                pageName: page_name,
                routeString
            };
            return result;
        }
        get basePath() {
            return this._pathBase;
        }
        pareeUrlQuery(query) {
            let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
            let urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            return urlParams;
        }
    }
    chitu.RouteParser = RouteParser;
    var PAGE_STACK_MAX_SIZE = 16;
    var ACTION_LOCATION_FORMATER = '{controller}/{action}';
    var VIEW_LOCATION_FORMATER = '{controller}/{action}';
    class Application {
        constructor() {
            this.pageCreated = chitu.Callbacks();
            this.pageType = chitu.Page;
            this._runned = false;
            this.page_stack = new Array();
            this.fileBasePath = DEFAULT_FILE_BASE_PATH;
            this.backFail = chitu.Callbacks();
        }
        parseRouteString(routeString) {
            let urlParser = new RouteParser(this.fileBasePath);
            return urlParser.parseRouteString(routeString);
        }
        on_pageCreated(page) {
            return chitu.fireCallback(this.pageCreated, this, page);
        }
        get currentPage() {
            if (this.page_stack.length > 0)
                return this.page_stack[this.page_stack.length - 1];
            return null;
        }
        get pages() {
            return this.page_stack;
        }
        createPage(routeData) {
            let previous_page = this.pages[this.pages.length - 1];
            let element = this.createPageElement(routeData);
            let displayer = new chitu.PageDisplayerImplement();
            element.setAttribute('name', routeData.pageName);
            console.assert(this.pageType != null);
            let page = new this.pageType({
                app: this,
                previous: previous_page,
                routeData: routeData,
                displayer,
                element
            });
            this.page_stack.push(page);
            if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
                let c = this.page_stack.shift();
                c.close();
            }
            return page;
        }
        createPageElement(routeData) {
            let element = document.createElement('page');
            document.body.appendChild(element);
            return element;
        }
        hashchange() {
            let location = window.location;
            if (location.skipHashChanged == true) {
                location.skipHashChanged = false;
                return;
            }
            var hash = window.location.hash;
            if (!hash) {
                console.log('The url is not contains hash.url is ' + window.location.href);
                return;
            }
            var routeString;
            if (location.hash.length > 1)
                routeString = location.hash.substr(1);
            var routeData = this.parseRouteString(routeString);
            var page = this.getPage(routeData.pageName);
            let previousPageIndex = this.page_stack.length - 2;
            if (page != null && this.page_stack.indexOf(page) == previousPageIndex) {
                this.closeCurrentPage();
            }
            else {
                this.showPage(routeString);
            }
        }
        run() {
            if (this._runned)
                return;
            var app = this;
            this.hashchange();
            window.addEventListener('hashchange', () => {
                this.hashchange();
            });
            this._runned = true;
        }
        getPage(name) {
            for (var i = this.page_stack.length - 1; i >= 0; i--) {
                var page = this.page_stack[i];
                if (page != null && page.name == name)
                    return page;
            }
            return null;
        }
        showPage(routeString, args) {
            if (!routeString)
                throw chitu.Errors.argumentNull('routeString');
            var routeData = this.parseRouteString(routeString);
            if (routeData == null) {
                throw chitu.Errors.noneRouteMatched(routeString);
            }
            routeData.values = chitu.extend(routeData.values, args || {});
            let previous = this.currentPage;
            let result = new Promise((resolve, reject) => {
                let page = this.createPage(routeData);
                this.on_pageCreated(page);
                page.show();
                resolve(page);
            });
            return result;
        }
        setLocationHash(routeString) {
            if (window.location.hash == '#' + routeString) {
                return;
            }
            let location = window.location;
            location.skipHashChanged = true;
            location.hash = '#' + routeString;
        }
        closeCurrentPage() {
            if (this.page_stack.length <= 0)
                return;
            var c = this.page_stack.pop();
            c.close();
            this.setLocationHash(this.currentPage.routeData.routeString);
        }
        redirect(routeString, args) {
            let location = window.location;
            let result = this.showPage(routeString, args);
            this.setLocationHash(routeString);
            return result;
        }
        back(args = undefined) {
            return new Promise((reslove, reject) => {
                if (this.page_stack.length == 0) {
                    reject();
                    chitu.fireCallback(this.backFail, this, {});
                    return;
                }
                this.closeCurrentPage();
                reslove();
            });
        }
    }
    chitu.Application = Application;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
    class Errors {
        static argumentNull(paramName) {
            var msg = `The argument "${paramName}" cannt be null.`;
            return new Error(msg);
        }
        static modelFileExpecteFunction(script) {
            var msg = `The eval result of script file "${script}" is expected a function.`;
            return new Error(msg);
        }
        static paramTypeError(paramName, expectedType) {
            var msg = `The param "${paramName}" is expected "${expectedType}" type.`;
            return new Error(msg);
        }
        static paramError(msg) {
            return new Error(msg);
        }
        static viewNodeNotExists(name) {
            var msg = `The view node "${name}" is not exists.`;
            return new Error(msg);
        }
        static pathPairRequireView(index) {
            var msg = `The view value is required for path pair, but the item with index "${index}" is miss it.`;
            return new Error(msg);
        }
        static notImplemented(name) {
            var msg = `'The method "${name}" is not implemented.'`;
            return new Error(msg);
        }
        static routeExists(name) {
            var msg = `Route named "${name}" is exists.`;
            return new Error(msg);
        }
        static noneRouteMatched(url) {
            var msg = `None route matched with url "${url}".`;
            var error = new Error(msg);
            return error;
        }
        static emptyStack() {
            return new Error('The stack is empty.');
        }
        static canntParseUrl(url) {
            var msg = `Can not parse the url "${url}" to route data.`;
            return new Error(msg);
        }
        static canntParseRouteString(routeString) {
            var msg = `Can not parse the route string "${routeString}" to route data.;`;
            return new Error(msg);
        }
        static routeDataRequireController() {
            var msg = 'The route data does not contains a "controller" file.';
            return new Error(msg);
        }
        static routeDataRequireAction() {
            var msg = 'The route data does not contains a "action" file.';
            return new Error(msg);
        }
        static viewCanntNull() {
            var msg = 'The view or viewDeferred of the page cannt null.';
            return new Error(msg);
        }
        static createPageFail(pageName) {
            var msg = `Create page "${pageName}" fail.`;
            return new Error(msg);
        }
        static actionTypeError(pageName) {
            let msg = `The action in page '${pageName}' is expect as function or Class.`;
            return new Error(msg);
        }
        static canntFindAction(pageName) {
            let msg = `Cannt find action in page '${pageName}', is the exports has default field?`;
            return new Error(msg);
        }
        static scrollerElementNotExists() {
            let msg = "Scroller element is not exists.";
            return new Error(msg);
        }
    }
    chitu.Errors = Errors;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
    class Callback {
        constructor() {
            this.event_name = 'chitu-event';
            this.event = document.createEvent('CustomEvent');
            this.element = document.createElement('div');
        }
        add(func) {
            this.element.addEventListener(this.event_name, (event) => {
                const sender = event.detail.sender;
                const args = event.detail.args;
                func(sender, ...args);
            });
        }
        remove(func) {
            this.element.removeEventListener(this.event_name, func);
        }
        fire(args) {
            this.event.initCustomEvent(this.event_name, true, false, args);
            this.element.dispatchEvent(this.event);
        }
    }
    chitu.Callback = Callback;
    function Callbacks() {
        return new Callback();
    }
    chitu.Callbacks = Callbacks;
    function fireCallback(callback, sender, ...args) {
        callback.fire({ sender, args });
    }
    chitu.fireCallback = fireCallback;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
    class Page {
        constructor(params) {
            this.animationTime = 300;
            this.load = chitu.Callbacks();
            this.showing = chitu.Callbacks();
            this.shown = chitu.Callbacks();
            this.hiding = chitu.Callbacks();
            this.hidden = chitu.Callbacks();
            this.closing = chitu.Callbacks();
            this.closed = chitu.Callbacks();
            this._element = params.element;
            this._previous = params.previous;
            this._app = params.app;
            this._routeData = params.routeData;
            this._displayer = params.displayer;
            this.loadPageAction(params.routeData);
        }
        on_load(...resources) {
            return chitu.fireCallback(this.load, this, resources);
        }
        on_showing() {
            return chitu.fireCallback(this.showing, this);
        }
        on_shown() {
            return chitu.fireCallback(this.shown, this);
        }
        on_hiding() {
            return chitu.fireCallback(this.hiding, this);
        }
        on_hidden() {
            return chitu.fireCallback(this.hidden, this);
        }
        on_closing() {
            return chitu.fireCallback(this.closing, this);
        }
        on_closed() {
            return chitu.fireCallback(this.closed, this);
        }
        show() {
            this.on_showing();
            this._displayer.show(this);
            this.on_shown();
        }
        hide() {
            this.on_hiding();
            this._displayer.hide(this);
            this.on_hidden();
        }
        close() {
            this.hide();
            this.on_closing();
            this._element.remove();
            this.on_closed();
        }
        get element() {
            return this._element;
        }
        get previous() {
            return this._previous;
        }
        get routeData() {
            return this._routeData;
        }
        get name() {
            return this.routeData.pageName;
        }
        createActionDeferred(routeData) {
            return new Promise((resolve, reject) => {
                var url = routeData.actionPath;
                requirejs([url], (obj) => {
                    if (!obj) {
                        let msg = `Load action '${routeData.pageName}' fail.`;
                        let err = new Error(msg);
                        reject(err);
                        return;
                    }
                    resolve(obj);
                }, (err) => reject(err));
            });
        }
        loadPageAction(routeData) {
            var action_deferred = new Promise((reslove, reject) => {
                this.createActionDeferred(routeData).then((actionResult) => {
                    let actionName = 'default';
                    let action = actionResult[actionName];
                    if (action == null) {
                        throw chitu.Errors.canntFindAction(routeData.pageName);
                    }
                    if (typeof action == 'function') {
                        if (action['prototype'] != null)
                            new action(this);
                        else
                            action(this);
                        reslove();
                    }
                    else {
                        reject();
                        throw chitu.Errors.actionTypeError(routeData.pageName);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
            let result = Promise.all([action_deferred, chitu.loadjs(...routeData.resource || [])]).then((results) => {
                let resourceResults = results[1];
                this.on_load(...resourceResults);
            });
            return result;
        }
    }
    chitu.Page = Page;
    class PageDisplayerImplement {
        show(page) {
            page.element.style.display = 'block';
            if (page.previous != null) {
                page.previous.element.style.display = 'none';
            }
        }
        hide(page) {
            page.element.style.display = 'none';
            if (page.previous != null) {
                page.previous.element.style.display = 'block';
            }
        }
    }
    chitu.PageDisplayerImplement = PageDisplayerImplement;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
    function extend(obj1, obj2) {
        if (obj1 == null)
            throw chitu.Errors.argumentNull('obj1');
        if (obj2 == null)
            throw chitu.Errors.argumentNull('obj2');
        for (let key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    }
    chitu.extend = extend;
    function combinePath(path1, path2) {
        if (!path1)
            throw chitu.Errors.argumentNull('path1');
        if (!path2)
            throw chitu.Errors.argumentNull('path2');
        path1 = path1.trim();
        if (!path1.endsWith('/'))
            path1 = path1 + '/';
        return path1 + path2;
    }
    chitu.combinePath = combinePath;
    function loadjs(...modules) {
        if (modules.length == 0)
            return Promise.resolve([]);
        return new Promise((reslove, reject) => {
            requirejs(modules, function () {
                var args = [];
                for (var i = 0; i < arguments.length; i++)
                    args[i] = arguments[i];
                reslove(args);
            }, function () {
                reject();
            });
        });
    }
    chitu.loadjs = loadjs;
})(chitu || (chitu = {}));

window['chitu'] = window['chitu'] || chitu 
                            
 return chitu;
            });