"use strict";

define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page, pageLoadPromise) {
        var advertItems = [];
        var productLoad = Promise.all([services.home.proudcts(), pageLoadPromise, chitu.loadjs('Controls/PromotionLabel')]).then(function (result) {
            var products = result[0];
            var data = { products: products, advertItems: advertItems };
            new Vue({ el: page.mainView, data: data });
        });
        Promise.all([services.home.advertItems(), productLoad]).then(function (result) {
            result[0].forEach(function (o) {
                return advertItems.push(o);
            });
            window.setTimeout(function () {
                var c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return productLoad;
    });
});
