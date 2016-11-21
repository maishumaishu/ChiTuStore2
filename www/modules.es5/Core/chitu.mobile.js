"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'chitu'], function (require, exports, chitu) {
    "use strict";

    var Errors = function () {
        function Errors() {
            _classCallCheck(this, Errors);
        }

        _createClass(Errors, null, [{
            key: "argumentNull",
            value: function argumentNull(paramName) {
                var msg = "Argument '" + paramName + "' can not be null";
                return new Error(msg);
            }
        }, {
            key: "headerExists",
            value: function headerExists(pageName) {
                var msg = "Header is exists in '" + pageName + "'.";
                return new Error(msg);
            }
        }, {
            key: "footerExists",
            value: function footerExists(pageName) {
                var msg = "Header is exists in '" + pageName + "'.";
                return new Error(msg);
            }
        }]);

        return Errors;
    }();

    var Exception = function (_Error) {
        _inherits(Exception, _Error);

        function Exception() {
            var _ref;

            _classCallCheck(this, Exception);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, (_ref = Exception.__proto__ || Object.getPrototypeOf(Exception)).call.apply(_ref, [this].concat(args)));

            _this.handled = false;
            return _this;
        }

        return Exception;
    }(Error);

    var headerTagName = 'header';
    var footerTagName = 'footer';
    var viewTagName = 'section';

    var Page = function (_chitu$Page) {
        _inherits(Page, _chitu$Page);

        function Page(params) {
            _classCallCheck(this, Page);

            var _this2 = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, params));

            _this2.views = ['main', 'loading', 'error'];
            _this2.headerHeight = 0;
            _this2.footerHeight = 0;
            _this2.resize = chitu.Callbacks();
            _this2._viewCompleted = false;
            _this2.app = params.app;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _this2.views[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var className = _step.value;

                    _this2.createView(className);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            _this2.showView('loading');
            _this2.load.add(function (sender, args) {
                _this2._viewCompleted = true;
                _this2.view('main').innerHTML = args.viewHTML || '';
            });
            _this2.resize.add(function (sender, args) {
                var elements = _this2.element.querySelectorAll(viewTagName);
                for (var i = 0; i < elements.length; i++) {
                    var element = elements.item(i);
                    var h = window.innerHeight - args.headerHeight - args.footerHeight;
                    element.style.height = h + 'px';
                    element.style.top = args.headerHeight + 'px';
                }
            });
            window.addEventListener('resize', function () {
                _this2.resize.fire(_this2, { headerHeight: _this2.headerHeight, footerHeight: _this2.footerHeight });
            });
            return _this2;
        }

        _createClass(Page, [{
            key: "createView",
            value: function createView(className) {
                var childElement = document.createElement(viewTagName);
                childElement.className = className;
                this.element.appendChild(childElement);
                return childElement;
            }
        }, {
            key: "showView",
            value: function showView(name) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.views[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        if (name == item) this.view(item).style.display = 'block';else this.view(item).style.display = 'none';
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }, {
            key: "showError",
            value: function showError(err) {
                var element = this.view('error');
                console.assert(element != null);
                element.innerHTML = "<span>" + err.message + "</span>";
                this.showView('error');
            }
        }, {
            key: "view",
            value: function view(className) {
                var element = this.element.querySelector("." + className);
                return element;
            }
        }, {
            key: "createHeader",
            value: function createHeader(headerHeight) {
                if (this.header != null) throw Errors.headerExists(this.routeData.pageName);
                var headerElement = document.createElement(headerTagName);
                this.headerHeight = headerHeight;
                headerElement.style.height = headerHeight + 'px';
                this.element.appendChild(headerElement);
                this.resize.fire(this, { headerHeight: headerHeight, footerHeight: this.footerHeight });
                return headerElement;
            }
        }, {
            key: "createFooter",
            value: function createFooter(footerHeight) {
                if (this.footer != null) throw Errors.footerExists(this.routeData.pageName);
                var footerElement = document.createElement('footer');
                footerElement.style.height = footerHeight + 'px';
                this.element.appendChild(footerElement);
                this.resize.fire(this, { headerHeight: this.headerHeight, footerHeight: footerHeight });
                return footerElement;
            }
        }, {
            key: "mainView",
            get: function get() {
                return this.view('main');
            }
        }, {
            key: "header",
            get: function get() {
                return this.element.querySelector(headerTagName);
            }
        }, {
            key: "footer",
            get: function get() {
                return this.element.querySelector(footerTagName);
            }
        }, {
            key: "viewCompleted",
            get: function get() {
                return this._viewCompleted;
            }
        }]);

        return Page;
    }(chitu.Page);

    exports.Page = Page;

    var Application = function (_chitu$Application) {
        _inherits(Application, _chitu$Application);

        function Application() {
            _classCallCheck(this, Application);

            var _this3 = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

            _this3.error = chitu.Callbacks();
            _set(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), "pageType", Page, _this3);
            return _this3;
        }

        _createClass(Application, [{
            key: "parseRouteString",
            value: function parseRouteString(routeString) {
                var routeData = _get(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), "parseRouteString", this).call(this, routeString);
                routeData.resources.push({ name: 'viewHTML', path: "text!" + routeData.actionPath + ".html" });
                return routeData;
            }
        }]);

        return Application;
    }(chitu.Application);

    exports.Application = Application;
    function action(callback) {
        return function (page) {
            var pageLoad = new Promise(function (reslove, reject) {
                if (page.viewCompleted) reslove();
                page.load.add(function () {
                    return reslove();
                });
            });
            var p = callback(page) || Promise.resolve();
            p.then(function () {
                page.showView('main');
            }).catch(function (err) {
                page.showError(err);
            });
        };
    }
    exports.action = action;
    ;
});
