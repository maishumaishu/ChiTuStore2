"use strict";

define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        var pageLoad = new Promise(function (reslove, reject) {
            page.load.add(function () {
                return reslove();
            });
        });
        var data = { products: [], advertItems: [] };
        var productLoad = Promise.all([services.home.proudcts(), pageLoad, chitu.loadjs('Controls/PromotionLabel')]).then(function (result) {
            var items = result[0];
            items.forEach(function (o) {
                return data.products.push(o);
            });
            new Vue({ el: page.mainView, data: data });
        });
        Promise.all([services.home.advertItems(), productLoad]).then(function (result) {
            var advertItems = result[0];
            advertItems.forEach(function (o) {
                return data.advertItems.push(o);
            });
            window.setTimeout(function () {
                var c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return productLoad;
    });
});
