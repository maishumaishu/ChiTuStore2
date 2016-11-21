define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        let pageLoad = new Promise((reslove, reject) => {
            page.load.add(() => reslove());
        });
        let data = { products: [], advertItems: [] };
        var productLoad = Promise.all([services.home.proudcts(), pageLoad, chitu.loadjs('Controls/PromotionLabel')])
            .then(result => {
            let items = result[0];
            items.forEach(o => data.products.push(o));
            new Vue({ el: page.mainView, data: data });
        });
        Promise.all([services.home.advertItems(), productLoad]).then((result) => {
            let advertItems = result[0];
            advertItems.forEach(o => data.advertItems.push(o));
            window.setTimeout(() => {
                let c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return productLoad;
    });
});
