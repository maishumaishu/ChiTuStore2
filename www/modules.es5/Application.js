"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", 'chitu.mobile'], function (require, exports, chitu_mobile_1) {
    "use strict";

    var MyPage = function (_chitu_mobile_1$Page) {
        _inherits(MyPage, _chitu_mobile_1$Page);

        function MyPage(params) {
            _classCallCheck(this, MyPage);

            var _this = _possibleConstructorReturn(this, (MyPage.__proto__ || Object.getPrototypeOf(MyPage)).call(this, params));

            _this.view('loading').innerHTML = "<div class=\"spin\">\n    <i class=\"icon-spinner icon-spin\"></i>\n</div>";
            return _this;
        }

        return MyPage;
    }(chitu_mobile_1.Page);

    var MyApplication = function (_chitu$Application) {
        _inherits(MyApplication, _chitu$Application);

        function MyApplication() {
            _classCallCheck(this, MyApplication);

            var _this2 = _possibleConstructorReturn(this, (MyApplication.__proto__ || Object.getPrototypeOf(MyApplication)).call(this));

            _this2.pageType = MyPage;
            return _this2;
        }

        _createClass(MyApplication, [{
            key: "parseRouteString",
            value: function parseRouteString(routeString) {
                var routeData = _get(MyApplication.prototype.__proto__ || Object.getPrototypeOf(MyApplication.prototype), "parseRouteString", this).call(this, routeString);
                var headerPath = void 0,
                    footerPath = void 0;
                switch (routeData.pageName) {
                    case 'Home.Index':
                        headerPath = "text!ui/headers/" + routeData.pageName + ".html";
                        footerPath = "text!ui/Menu.html";
                        break;
                    default:
                        headerPath = "text!ui/headers/DefaultWithBack.html";
                        break;
                }
                if (headerPath) routeData.resources.push({ name: 'headerHTML', path: headerPath });
                if (footerPath) routeData.resources.push({ name: 'footerHTML', path: footerPath });
                var path = routeData.actionPath.substr(routeData.basePath.length);
                var cssPath = "css!content/app" + path;
                routeData.resources.push({ name: 'pageCSS', path: cssPath });
                routeData.resources.push({ name: 'viewHTML', path: "text!pages" + path + ".html" });
                return routeData;
            }
        }, {
            key: "createPage",
            value: function createPage(routeData) {
                var page = _get(MyApplication.prototype.__proto__ || Object.getPrototypeOf(MyApplication.prototype), "createPage", this).call(this, routeData);
                console.assert(page instanceof chitu_mobile_1.Page);
                page.load.add(function (sender, args) {
                    var headerHTML = args.headerHTML,
                        footerHTML = args.footerHTML;

                    console.assert(headerHTML != null);
                    if (headerHTML) {
                        var element = page.createHeader(65);
                        element.innerHTML = headerHTML;
                    }
                    if (footerHTML) {
                        var _element = page.createFooter(50);
                        _element.innerHTML = footerHTML;
                    }
                });
                var className = routeData.pageName.split('.').join('-');
                className = className + ' immersion';
                page.element.className = className;
                return page;
            }
        }]);

        return MyApplication;
    }(chitu.Application);

    exports.app = new MyApplication();
    exports.app.run();
    if (!location.hash) {
        exports.app.redirect('home/index');
    }
});
