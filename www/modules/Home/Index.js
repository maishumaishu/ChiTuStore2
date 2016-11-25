define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page, pageLoadPromise) {
        let advertItems = [];
        var productLoad = Promise.all([services.home.proudcts(), pageLoadPromise, chitu.loadjs('Controls/PromotionLabel')])
            .then(result => {
            let products = result[0];
            let data = { products: products, advertItems: advertItems };
            new Vue({ el: page.mainView, data: data });
        });
        Promise.all([services.home.advertItems(), productLoad]).then((result) => {
            result[0].forEach(o => advertItems.push(o));
            window.setTimeout(() => {
                let c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return productLoad;
    });
});
