define(["require", "exports", 'fetch'], function (require, exports, fetch) {
    "use strict";
    const SERVICE_HOST = 'service.alinq.cn:2014';
    let config = {
        service: {
            shop: `http://${SERVICE_HOST}/Shop/`,
            site: `http://${SERVICE_HOST}/Site/`,
            member: `http://${SERVICE_HOST}/Member/`,
            weixin: `http://${SERVICE_HOST}/WeiXin/`,
            account: `http://${SERVICE_HOST}/Account/`,
        },
        appToken: '7F0B6740588DCFA7E1C29C627B8C87379F1C98D5962FAB01D0D604307C04BFF0182BAE0B98307143'
    };
    let token = '';
    function ajax(url, data) {
        data = data || {};
        Object.assign(data, { AppToken: config.appToken });
        var form = new FormData();
        for (let key in data) {
            form.append(key, data[key]);
        }
        let options = {
            body: form,
            method: 'post'
        };
        return fetch(url, options).then((response) => {
            let text = response.text();
            let p;
            if (typeof text == 'string') {
                p = new Promise((reslove, reject) => {
                    reslove(text);
                });
            }
            else {
                p = text;
            }
            return p.then((text) => {
                return new Promise((resolve, reject) => {
                    let data = JSON.parse(text);
                    if (data.Type != 'ErrorObject')
                        resolve(data);
                    if (data.Code == 'Success') {
                        resolve(data);
                        return;
                    }
                    let err = new Error(data.Message);
                    err.name = data.Code;
                    reject(err);
                    return;
                });
            });
        });
    }
    exports.ajax = ajax;
    const imageBasePath = 'http://service.alinq.cn:2015/Shop';
    var home;
    (function (home) {
        function proudcts(pageIndex) {
            pageIndex = pageIndex === undefined ? 0 : pageIndex;
            let url = config.service.site + 'Home/GetHomeProducts';
            return ajax(url, { pageIndex: pageIndex }).then((products) => {
                for (let product of products) {
                    product.ImagePath = imageBasePath + product.ImagePath;
                }
                return products;
            });
        }
        home.proudcts = proudcts;
        function brands() {
            let url = config.service.shop + 'Product/GetBrands';
            return ajax(url);
        }
        home.brands = brands;
        function getProduct(productId) {
            let url = config.service.shop + 'Product/GetProduct';
            return ajax(url, { productId: productId });
        }
        home.getProduct = getProduct;
        function advertItems() {
            let url = config.service.site + 'Home/GetAdvertItems';
            return ajax(url);
        }
        home.advertItems = advertItems;
    })(home = exports.home || (exports.home = {}));
});
