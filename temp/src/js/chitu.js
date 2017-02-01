(function(factory) { 
        if (typeof define === 'function' && define['amd']) { 
            define(factory);  
        } else { 
            factory(); 
        } 
    })(function() {var chitu;
(function (chitu) {
    const DEFAULT_FILE_BASE_PATH = 'modules';
    class RouteData {
        constructor(basePath, routeString, pathSpliterChar) {
            this._parameters = {};
            this.path_string = '';
            this.path_spliter_char = '/';
            this.path_contact_char = '/';
            this.param_spliter = '?';
            this.name_spliter_char = '.';
            this._pathBase = '';
            if (!basePath)
                throw chitu.Errors.argumentNull('basePath');
            if (!routeString)
                throw chitu.Errors.argumentNull('routeString');
            if (pathSpliterChar)
                this.path_spliter_char = pathSpliterChar;
            this._loadCompleted = false;
            this._routeString = routeString;
            this._pathBase = basePath;
            this.parseRouteString();
            let routeData = this;
        }
        parseRouteString() {
            let routeString = this.routeString;
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
            let file_path = path_parts.join(this.path_contact_char);
            this._pageName = path_parts.join(this.name_spliter_char);
            this._actionPath = (this.basePath ? chitu.combinePath(this.basePath, file_path) : file_path);
        }
        pareeUrlQuery(query) {
            let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
            let urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            return urlParams;
        }
        get basePath() {
            return this._pathBase;
        }
        get values() {
            return this._parameters;
        }
        get pageName() {
            return this._pageName;
        }
        get routeString() {
            return this._routeString;
        }
        get actionPath() {
            return this._actionPath;
        }
        get loadCompleted() {
            return this._loadCompleted;
        }
    }
    chitu.RouteData = RouteData;
    var PAGE_STACK_MAX_SIZE = 20;
    var ACTION_LOCATION_FORMATER = '{controller}/{action}';
    var VIEW_LOCATION_FORMATER = '{controller}/{action}';
    class Application {
        constructor() {
            this.pageCreated = chitu.Callbacks();
            this.pageType = chitu.Page;
            this.pageDisplayType = chitu.PageDisplayerImplement;
            this._runned = false;
            this.page_stack = new Array();
            this.cachePages = {};
            this.fileBasePath = DEFAULT_FILE_BASE_PATH;
            this.backFail = chitu.Callbacks();
        }
        parseRouteString(routeString) {
            let routeData = new RouteData(this.fileBasePath, routeString);
            return routeData;
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
            let displayer = new this.pageDisplayType(this);
            console.assert(this.pageType != null);
            let page = new this.pageType({
                app: this,
                previous: previous_page,
                routeData: routeData,
                displayer,
                element
            });
            this.on_pageCreated(page);
            return page;
        }
        createPageElement(routeData) {
            let element = document.createElement(chitu.Page.tagName);
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
            Object.assign(routeData.values, args || {});
            let page = this.cachePages[routeData.pageName];
            if (page == null) {
                page = this.createPage(routeData);
                if (page.allowCache) {
                    this.cachePages[routeData.pageName] = page;
                }
            }
            if (page == this.currentPage) {
                return page;
            }
            let previous = this.currentPage;
            this.page_stack.push(page);
            if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
                let c = this.page_stack.shift();
                if (!this.cachePages[routeData.pageName])
                    c.close();
            }
            page.previous = previous;
            page.show();
            return page;
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
            var page = this.page_stack.pop();
            if (page.allowCache) {
                page.hide();
            }
            else {
                page.close();
                if (this.cachePages[page.name])
                    this.cachePages[page.name] = null;
            }
            if (this.currentPage != null)
                this.setLocationHash(this.currentPage.routeData.routeString);
        }
        clearPageStack() {
            this.page_stack = [];
        }
        redirect(routeString, args) {
            let location = window.location;
            let result = this.showPage(routeString, args);
            this.setLocationHash(routeString);
            return result;
        }
        back(args = undefined) {
            this.closeCurrentPage();
            if (this.page_stack.length == 0) {
                chitu.fireCallback(this.backFail, this, {});
            }
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
        static exportsCanntNull(pageName) {
            let msg = `Exports of page '${pageName}' is null.`;
        }
        static scrollerElementNotExists() {
            let msg = "Scroller element is not exists.";
            return new Error(msg);
        }
        static resourceExists(resourceName, pageName) {
            let msg = `Rosource '${resourceName}' is exists in the resources of page '${pageName}'.`;
            return new Error(msg);
        }
    }
    chitu.Errors = Errors;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
    class Callback {
        constructor() {
            this.funcs = new Array();
        }
        add(func) {
            this.funcs.push(func);
        }
        remove(func) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(sender, args) {
            this.funcs.forEach(o => o(sender, args));
        }
    }
    chitu.Callback = Callback;
    function Callbacks() {
        return new Callback();
    }
    chitu.Callbacks = Callbacks;
    function fireCallback(callback, sender, args) {
        callback.fire(sender, args);
    }
    chitu.fireCallback = fireCallback;
})(chitu || (chitu = {}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var chitu;
(function (chitu) {
    class Page {
        constructor(params) {
            this.animationTime = 300;
            this.allowCache = false;
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
            this.loadPageAction();
        }
        on_load(args) {
            return chitu.fireCallback(this.load, this, args);
        }
        on_showing() {
            return chitu.fireCallback(this.showing, this, {});
        }
        on_shown() {
            return chitu.fireCallback(this.shown, this, {});
        }
        on_hiding() {
            return chitu.fireCallback(this.hiding, this, {});
        }
        on_hidden() {
            return chitu.fireCallback(this.hidden, this, {});
        }
        on_closing() {
            return chitu.fireCallback(this.closing, this, {});
        }
        on_closed() {
            return chitu.fireCallback(this.closed, this, {});
        }
        show() {
            this.on_showing();
            return this._displayer.show(this).then(o => {
                this.on_shown();
            });
        }
        hide() {
            this.on_hiding();
            return this._displayer.hide(this).then(o => {
                this.on_hidden();
            });
        }
        close() {
            return this.hide().then(() => {
                this.on_closing();
                this._element.remove();
                this.on_closed();
            });
        }
        get element() {
            return this._element;
        }
        get previous() {
            return this._previous;
        }
        set previous(value) {
            this._previous = value;
        }
        get routeData() {
            return this._routeData;
        }
        get name() {
            return this.routeData.pageName;
        }
        loadPageAction() {
            return __awaiter(this, void 0, void 0, function* () {
                console.assert(this._routeData != null);
                let routeData = this._routeData;
                var url = routeData.actionPath;
                let actionResult = yield chitu.loadjs(url);
                if (!actionResult)
                    throw chitu.Errors.exportsCanntNull(routeData.pageName);
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
                }
                else {
                    throw chitu.Errors.actionTypeError(routeData.pageName);
                }
                let args = {};
                this.on_load(args);
            });
        }
        reload() {
            return this.loadPageAction();
        }
    }
    Page.tagName = 'div';
    chitu.Page = Page;
    class PageDisplayerImplement {
        show(page) {
            page.element.style.display = 'block';
            if (page.previous != null) {
                page.previous.element.style.display = 'none';
            }
            return Promise.resolve();
        }
        hide(page) {
            page.element.style.display = 'none';
            if (page.previous != null) {
                page.previous.element.style.display = 'block';
            }
            return Promise.resolve();
        }
    }
    chitu.PageDisplayerImplement = PageDisplayerImplement;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
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
    function loadjs(path) {
        return new Promise((reslove, reject) => {
            requirejs([path], function (result) {
                reslove(result);
            }, function (err) {
                reject(err);
            });
        });
    }
    chitu.loadjs = loadjs;
})(chitu || (chitu = {}));

window['chitu'] = window['chitu'] || chitu 
                            
 return chitu;
            });