define(["require", "exports", 'chitu.mobile', 'services', 'carousel'], function (require, exports, chitu_mobile_1, services, Carousel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        let data = { products: [], advertItems: [] };
        page.load.add(() => new Vue({ el: page.mainView, data: data }));
        services.home.advertItems().then((advertItems) => {
            advertItems.forEach(o => data.advertItems.push(o));
            window.setTimeout(() => {
                let c = new Carousel(page.element.querySelector('[name="ad-swiper"]'));
            }, 10);
        });
        return Promise.all([services.home.proudcts(), chitu.loadjs('Controls/PromotionLabel')])
            .then(result => {
            let items = result[0];
            items.forEach(o => data.products.push(o));
        });
    });
});
