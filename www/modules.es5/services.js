"use strict";

define(["require", "exports", 'fetch'], function (require, exports, fetch) {
    "use strict";

    var SERVICE_HOST = 'service.alinq.cn:2014';
    var config = {
        service: {
            shop: "http://" + SERVICE_HOST + "/Shop/",
            site: "http://" + SERVICE_HOST + "/Site/",
            member: "http://" + SERVICE_HOST + "/Member/",
            weixin: "http://" + SERVICE_HOST + "/WeiXin/",
            account: "http://" + SERVICE_HOST + "/Account/"
        },
        appToken: '7F0B6740588DCFA7E1C29C627B8C87379F1C98D5962FAB01D0D604307C04BFF0182BAE0B98307143'
    };
    var token = '';
    function ajax(url, data) {
        data = data || {};
        Object.assign(data, { AppToken: config.appToken });
        var form = new FormData();
        for (var key in data) {
            form.append(key, data[key]);
        }
        var options = {
            body: form,
            method: 'post'
        };
        return fetch(url, options).then(function (response) {
            var text = response.text();
            var p = void 0;
            if (typeof text == 'string') {
                p = new Promise(function (reslove, reject) {
                    reslove(text);
                });
            } else {
                p = text;
            }
            return p.then(function (text) {
                return new Promise(function (resolve, reject) {
                    var data = JSON.parse(text);
                    if (data.Type != 'ErrorObject') resolve(data);
                    if (data.Code == 'Success') {
                        resolve(data);
                        return;
                    }
                    var err = new Error(data.Message);
                    err.name = data.Code;
                    reject(err);
                    return;
                });
            });
        });
    }
    exports.ajax = ajax;
    var imageBasePath = 'http://service.alinq.cn:2015/Shop';
    var home;
    (function (home) {
        function proudcts(pageIndex) {
            pageIndex = pageIndex === undefined ? 0 : pageIndex;
            var url = config.service.site + 'Home/GetHomeProducts';
            return ajax(url, { pageIndex: pageIndex }).then(function (products) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = products[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var product = _step.value;

                        product.ImagePath = imageBasePath + product.ImagePath;
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

                return products;
            });
        }
        home.proudcts = proudcts;
        function brands() {
            var url = config.service.shop + 'Product/GetBrands';
            return ajax(url);
        }
        home.brands = brands;
        function getProduct(productId) {
            var url = config.service.shop + 'Product/GetProduct';
            return ajax(url, { productId: productId }).then(function (product) {
                product.Count = 1;
                if (!product.ImageUrls && product.ImageUrl != null) product.ImageUrls = product.ImageUrl.split(',');
                return product;
            });
        }
        home.getProduct = getProduct;
        function advertItems() {
            var url = config.service.site + 'Home/GetAdvertItems';
            return ajax(url);
        }
        home.advertItems = advertItems;
    })(home = exports.home || (exports.home = {}));
});
