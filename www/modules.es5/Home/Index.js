"use strict";

define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        var data = { products: [], advertItems: [] };
        page.load.add(function () {
            return new Vue({ el: page.mainView, data: data });
        });
        services.home.advertItems().then(function (advertItems) {
            advertItems.forEach(function (o) {
                return data.advertItems.push(o);
            });
            window.setTimeout(function () {
                var c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return Promise.all([services.home.proudcts(), chitu.loadjs('Controls/PromotionLabel')]).then(function (result) {
            var items = result[0];
            items.forEach(function (o) {
                return data.products.push(o);
            });
        });
    });
});
