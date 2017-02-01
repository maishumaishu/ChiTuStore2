(function(factory) { 
        if (typeof define === 'function' && define['amd']) { 
            define(factory);  
        } else { 
            factory(); 
        } 
    })(function() {'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chitu;
(function (chitu) {
    var DEFAULT_FILE_BASE_PATH = 'modules';

    var RouteData = function () {
        function RouteData(basePath, routeString, pathSpliterChar) {
            _classCallCheck(this, RouteData);

            this._parameters = {};
            this.path_string = '';
            this.path_spliter_char = '/';
            this.path_contact_char = '/';
            this.param_spliter = '?';
            this.name_spliter_char = '.';
            this._pathBase = '';
            if (!basePath) throw chitu.Errors.argumentNull('basePath');
            if (!routeString) throw chitu.Errors.argumentNull('routeString');
            if (pathSpliterChar) this.path_spliter_char = pathSpliterChar;
            this._loadCompleted = false;
            this._routeString = routeString;
            this._pathBase = basePath;
            this.parseRouteString();
            var routeData = this;
        }

        _createClass(RouteData, [{
            key: 'parseRouteString',
            value: function parseRouteString() {
                var routeString = this.routeString;
                var routePath = void 0;
                var search = void 0;
                var param_spliter_index = routeString.indexOf(this.param_spliter);
                if (param_spliter_index > 0) {
                    search = routeString.substr(param_spliter_index + 1);
                    routePath = routeString.substring(0, param_spliter_index);
                } else {
                    routePath = routeString;
                }
                if (!routePath) throw chitu.Errors.canntParseRouteString(routeString);
                if (search) {
                    this._parameters = this.pareeUrlQuery(search);
                }
                var path_parts = routePath.split(this.path_spliter_char).map(function (o) {
                    return o.trim();
                }).filter(function (o) {
                    return o != '';
                });
                if (path_parts.length < 1) {
                    throw chitu.Errors.canntParseRouteString(routeString);
                }
                var file_path = path_parts.join(this.path_contact_char);
                this._pageName = path_parts.join(this.name_spliter_char);
                this._actionPath = this.basePath ? chitu.combinePath(this.basePath, file_path) : file_path;
            }
        }, {
            key: 'pareeUrlQuery',
            value: function pareeUrlQuery(query) {
                var match = void 0,
                    pl = /\+/g,
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function decode(s) {
                    return decodeURIComponent(s.replace(pl, " "));
                };
                var urlParams = {};
                while (match = search.exec(query)) {
                    urlParams[decode(match[1])] = decode(match[2]);
                }return urlParams;
            }
        }, {
            key: 'basePath',
            get: function get() {
                return this._pathBase;
            }
        }, {
            key: 'values',
            get: function get() {
                return this._parameters;
            }
        }, {
            key: 'pageName',
            get: function get() {
                return this._pageName;
            }
        }, {
            key: 'routeString',
            get: function get() {
                return this._routeString;
            }
        }, {
            key: 'actionPath',
            get: function get() {
                return this._actionPath;
            }
        }, {
            key: 'loadCompleted',
            get: function get() {
                return this._loadCompleted;
            }
        }]);

        return RouteData;
    }();

    chitu.RouteData = RouteData;
    var PAGE_STACK_MAX_SIZE = 20;
    var ACTION_LOCATION_FORMATER = '{controller}/{action}';
    var VIEW_LOCATION_FORMATER = '{controller}/{action}';

    var Application = function () {
        function Application() {
            _classCallCheck(this, Application);

            this.pageCreated = chitu.Callbacks();
            this.pageType = chitu.Page;
            this.pageDisplayType = chitu.PageDisplayerImplement;
            this._runned = false;
            this.page_stack = new Array();
            this.cachePages = {};
            this.fileBasePath = DEFAULT_FILE_BASE_PATH;
            this.backFail = chitu.Callbacks();
        }

        _createClass(Application, [{
            key: 'parseRouteString',
            value: function parseRouteString(routeString) {
                var routeData = new RouteData(this.fileBasePath, routeString);
                return routeData;
            }
        }, {
            key: 'on_pageCreated',
            value: function on_pageCreated(page) {
                return chitu.fireCallback(this.pageCreated, this, page);
            }
        }, {
            key: 'createPage',
            value: function createPage(routeData) {
                var previous_page = this.pages[this.pages.length - 1];
                var element = this.createPageElement(routeData);
                var displayer = new this.pageDisplayType(this);
                console.assert(this.pageType != null);
                var page = new this.pageType({
                    app: this,
                    previous: previous_page,
                    routeData: routeData,
                    displayer: displayer,
                    element: element
                });
                this.on_pageCreated(page);
                return page;
            }
        }, {
            key: 'createPageElement',
            value: function createPageElement(routeData) {
                var element = document.createElement(chitu.Page.tagName);
                document.body.appendChild(element);
                return element;
            }
        }, {
            key: 'hashchange',
            value: function hashchange() {
                var location = window.location;
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
                if (location.hash.length > 1) routeString = location.hash.substr(1);
                var routeData = this.parseRouteString(routeString);
                var page = this.getPage(routeData.pageName);
                var previousPageIndex = this.page_stack.length - 2;
                if (page != null && this.page_stack.indexOf(page) == previousPageIndex) {
                    this.closeCurrentPage();
                } else {
                    this.showPage(routeString);
                }
            }
        }, {
            key: 'run',
            value: function run() {
                var _this = this;

                if (this._runned) return;
                var app = this;
                this.hashchange();
                window.addEventListener('hashchange', function () {
                    _this.hashchange();
                });
                this._runned = true;
            }
        }, {
            key: 'getPage',
            value: function getPage(name) {
                for (var i = this.page_stack.length - 1; i >= 0; i--) {
                    var page = this.page_stack[i];
                    if (page != null && page.name == name) return page;
                }
                return null;
            }
        }, {
            key: 'showPage',
            value: function showPage(routeString, args) {
                if (!routeString) throw chitu.Errors.argumentNull('routeString');
                var routeData = this.parseRouteString(routeString);
                if (routeData == null) {
                    throw chitu.Errors.noneRouteMatched(routeString);
                }
                Object.assign(routeData.values, args || {});
                var page = this.cachePages[routeData.pageName];
                if (page == null) {
                    page = this.createPage(routeData);
                    if (page.allowCache) {
                        this.cachePages[routeData.pageName] = page;
                    }
                }
                if (page == this.currentPage) {
                    return page;
                }
                var previous = this.currentPage;
                this.page_stack.push(page);
                if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
                    var c = this.page_stack.shift();
                    if (!this.cachePages[routeData.pageName]) c.close();
                }
                page.previous = previous;
                page.show();
                return page;
            }
        }, {
            key: 'setLocationHash',
            value: function setLocationHash(routeString) {
                if (window.location.hash == '#' + routeString) {
                    return;
                }
                var location = window.location;
                location.skipHashChanged = true;
                location.hash = '#' + routeString;
            }
        }, {
            key: 'closeCurrentPage',
            value: function closeCurrentPage() {
                if (this.page_stack.length <= 0) return;
                var page = this.page_stack.pop();
                if (page.allowCache) {
                    page.hide();
                } else {
                    page.close();
                    if (this.cachePages[page.name]) this.cachePages[page.name] = null;
                }
                if (this.currentPage != null) this.setLocationHash(this.currentPage.routeData.routeString);
            }
        }, {
            key: 'clearPageStack',
            value: function clearPageStack() {
                this.page_stack = [];
            }
        }, {
            key: 'redirect',
            value: function redirect(routeString, args) {
                var location = window.location;
                var result = this.showPage(routeString, args);
                this.setLocationHash(routeString);
                return result;
            }
        }, {
            key: 'back',
            value: function back() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

                this.closeCurrentPage();
                if (this.page_stack.length == 0) {
                    chitu.fireCallback(this.backFail, this, {});
                }
            }
        }, {
            key: 'currentPage',
            get: function get() {
                if (this.page_stack.length > 0) return this.page_stack[this.page_stack.length - 1];
                return null;
            }
        }, {
            key: 'pages',
            get: function get() {
                return this.page_stack;
            }
        }]);

        return Application;
    }();

    chitu.Application = Application;
})(chitu || (chitu = {}));
//# sourceMappingURL=Application.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chitu;
(function (chitu) {
    var Errors = function () {
        function Errors() {
            _classCallCheck(this, Errors);
        }

        _createClass(Errors, null, [{
            key: 'argumentNull',
            value: function argumentNull(paramName) {
                var msg = 'The argument "' + paramName + '" cannt be null.';
                return new Error(msg);
            }
        }, {
            key: 'modelFileExpecteFunction',
            value: function modelFileExpecteFunction(script) {
                var msg = 'The eval result of script file "' + script + '" is expected a function.';
                return new Error(msg);
            }
        }, {
            key: 'paramTypeError',
            value: function paramTypeError(paramName, expectedType) {
                var msg = 'The param "' + paramName + '" is expected "' + expectedType + '" type.';
                return new Error(msg);
            }
        }, {
            key: 'paramError',
            value: function paramError(msg) {
                return new Error(msg);
            }
        }, {
            key: 'viewNodeNotExists',
            value: function viewNodeNotExists(name) {
                var msg = 'The view node "' + name + '" is not exists.';
                return new Error(msg);
            }
        }, {
            key: 'pathPairRequireView',
            value: function pathPairRequireView(index) {
                var msg = 'The view value is required for path pair, but the item with index "' + index + '" is miss it.';
                return new Error(msg);
            }
        }, {
            key: 'notImplemented',
            value: function notImplemented(name) {
                var msg = '\'The method "' + name + '" is not implemented.\'';
                return new Error(msg);
            }
        }, {
            key: 'routeExists',
            value: function routeExists(name) {
                var msg = 'Route named "' + name + '" is exists.';
                return new Error(msg);
            }
        }, {
            key: 'noneRouteMatched',
            value: function noneRouteMatched(url) {
                var msg = 'None route matched with url "' + url + '".';
                var error = new Error(msg);
                return error;
            }
        }, {
            key: 'emptyStack',
            value: function emptyStack() {
                return new Error('The stack is empty.');
            }
        }, {
            key: 'canntParseUrl',
            value: function canntParseUrl(url) {
                var msg = 'Can not parse the url "' + url + '" to route data.';
                return new Error(msg);
            }
        }, {
            key: 'canntParseRouteString',
            value: function canntParseRouteString(routeString) {
                var msg = 'Can not parse the route string "' + routeString + '" to route data.;';
                return new Error(msg);
            }
        }, {
            key: 'routeDataRequireController',
            value: function routeDataRequireController() {
                var msg = 'The route data does not contains a "controller" file.';
                return new Error(msg);
            }
        }, {
            key: 'routeDataRequireAction',
            value: function routeDataRequireAction() {
                var msg = 'The route data does not contains a "action" file.';
                return new Error(msg);
            }
        }, {
            key: 'viewCanntNull',
            value: function viewCanntNull() {
                var msg = 'The view or viewDeferred of the page cannt null.';
                return new Error(msg);
            }
        }, {
            key: 'createPageFail',
            value: function createPageFail(pageName) {
                var msg = 'Create page "' + pageName + '" fail.';
                return new Error(msg);
            }
        }, {
            key: 'actionTypeError',
            value: function actionTypeError(pageName) {
                var msg = 'The action in page \'' + pageName + '\' is expect as function or Class.';
                return new Error(msg);
            }
        }, {
            key: 'canntFindAction',
            value: function canntFindAction(pageName) {
                var msg = 'Cannt find action in page \'' + pageName + '\', is the exports has default field?';
                return new Error(msg);
            }
        }, {
            key: 'exportsCanntNull',
            value: function exportsCanntNull(pageName) {
                var msg = 'Exports of page \'' + pageName + '\' is null.';
            }
        }, {
            key: 'scrollerElementNotExists',
            value: function scrollerElementNotExists() {
                var msg = "Scroller element is not exists.";
                return new Error(msg);
            }
        }, {
            key: 'resourceExists',
            value: function resourceExists(resourceName, pageName) {
                var msg = 'Rosource \'' + resourceName + '\' is exists in the resources of page \'' + pageName + '\'.';
                return new Error(msg);
            }
        }]);

        return Errors;
    }();

    chitu.Errors = Errors;
})(chitu || (chitu = {}));
//# sourceMappingURL=Errors.js.map

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chitu;
(function (chitu) {
    var Callback = function () {
        function Callback() {
            _classCallCheck(this, Callback);

            this.funcs = new Array();
        }

        _createClass(Callback, [{
            key: "add",
            value: function add(func) {
                this.funcs.push(func);
            }
        }, {
            key: "remove",
            value: function remove(func) {
                this.funcs = this.funcs.filter(function (o) {
                    return o != func;
                });
            }
        }, {
            key: "fire",
            value: function fire(sender, args) {
                this.funcs.forEach(function (o) {
                    return o(sender, args);
                });
            }
        }]);

        return Callback;
    }();

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
//# sourceMappingURL=Extends.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var chitu;
(function (chitu) {
    var Page = function () {
        function Page(params) {
            _classCallCheck(this, Page);

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

        _createClass(Page, [{
            key: 'on_load',
            value: function on_load(args) {
                return chitu.fireCallback(this.load, this, args);
            }
        }, {
            key: 'on_showing',
            value: function on_showing() {
                return chitu.fireCallback(this.showing, this, {});
            }
        }, {
            key: 'on_shown',
            value: function on_shown() {
                return chitu.fireCallback(this.shown, this, {});
            }
        }, {
            key: 'on_hiding',
            value: function on_hiding() {
                return chitu.fireCallback(this.hiding, this, {});
            }
        }, {
            key: 'on_hidden',
            value: function on_hidden() {
                return chitu.fireCallback(this.hidden, this, {});
            }
        }, {
            key: 'on_closing',
            value: function on_closing() {
                return chitu.fireCallback(this.closing, this, {});
            }
        }, {
            key: 'on_closed',
            value: function on_closed() {
                return chitu.fireCallback(this.closed, this, {});
            }
        }, {
            key: 'show',
            value: function show() {
                var _this = this;

                this.on_showing();
                return this._displayer.show(this).then(function (o) {
                    _this.on_shown();
                });
            }
        }, {
            key: 'hide',
            value: function hide() {
                var _this2 = this;

                this.on_hiding();
                return this._displayer.hide(this).then(function (o) {
                    _this2.on_hidden();
                });
            }
        }, {
            key: 'close',
            value: function close() {
                var _this3 = this;

                return this.hide().then(function () {
                    _this3.on_closing();
                    _this3._element.remove();
                    _this3.on_closed();
                });
            }
        }, {
            key: 'loadPageAction',
            value: function loadPageAction() {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                    var routeData, url, actionResult, actionName, action, args;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    console.assert(this._routeData != null);
                                    routeData = this._routeData;
                                    url = routeData.actionPath;
                                    _context.next = 5;
                                    return chitu.loadjs(url);

                                case 5:
                                    actionResult = _context.sent;

                                    if (actionResult) {
                                        _context.next = 8;
                                        break;
                                    }

                                    throw chitu.Errors.exportsCanntNull(routeData.pageName);

                                case 8:
                                    actionName = 'default';
                                    action = actionResult[actionName];

                                    if (!(action == null)) {
                                        _context.next = 12;
                                        break;
                                    }

                                    throw chitu.Errors.canntFindAction(routeData.pageName);

                                case 12:
                                    if (!(typeof action == 'function')) {
                                        _context.next = 16;
                                        break;
                                    }

                                    if (action['prototype'] != null) new action(this);else action(this);
                                    _context.next = 17;
                                    break;

                                case 16:
                                    throw chitu.Errors.actionTypeError(routeData.pageName);

                                case 17:
                                    args = {};

                                    this.on_load(args);

                                case 19:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));
            }
        }, {
            key: 'reload',
            value: function reload() {
                return this.loadPageAction();
            }
        }, {
            key: 'element',
            get: function get() {
                return this._element;
            }
        }, {
            key: 'previous',
            get: function get() {
                return this._previous;
            },
            set: function set(value) {
                this._previous = value;
            }
        }, {
            key: 'routeData',
            get: function get() {
                return this._routeData;
            }
        }, {
            key: 'name',
            get: function get() {
                return this.routeData.pageName;
            }
        }]);

        return Page;
    }();

    Page.tagName = 'div';
    chitu.Page = Page;

    var PageDisplayerImplement = function () {
        function PageDisplayerImplement() {
            _classCallCheck(this, PageDisplayerImplement);
        }

        _createClass(PageDisplayerImplement, [{
            key: 'show',
            value: function show(page) {
                page.element.style.display = 'block';
                if (page.previous != null) {
                    page.previous.element.style.display = 'none';
                }
                return Promise.resolve();
            }
        }, {
            key: 'hide',
            value: function hide(page) {
                page.element.style.display = 'none';
                if (page.previous != null) {
                    page.previous.element.style.display = 'block';
                }
                return Promise.resolve();
            }
        }]);

        return PageDisplayerImplement;
    }();

    chitu.PageDisplayerImplement = PageDisplayerImplement;
})(chitu || (chitu = {}));
//# sourceMappingURL=Page.js.map

'use strict';

var chitu;
(function (chitu) {
    function combinePath(path1, path2) {
        if (!path1) throw chitu.Errors.argumentNull('path1');
        if (!path2) throw chitu.Errors.argumentNull('path2');
        path1 = path1.trim();
        if (!path1.endsWith('/')) path1 = path1 + '/';
        return path1 + path2;
    }
    chitu.combinePath = combinePath;
    function loadjs(path) {
        return new Promise(function (reslove, reject) {
            requirejs([path], function (result) {
                reslove(result);
            }, function (err) {
                reject(err);
            });
        });
    }
    chitu.loadjs = loadjs;
})(chitu || (chitu = {}));
//# sourceMappingURL=Utility.js.map

window['chitu'] = window['chitu'] || chitu 
                            
 return chitu;
            });