define(["require", "exports", 'chitu.mobile', 'services', 'vue.ext', 'carousel'], function (require, exports, chitu_mobile_1, services, vue_ext_1, Carousel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        let result = Promise.all([services.home.proudcts(), services.home.brands(), services.home.advertItems()])
            .then((args) => {
            let products = args[0];
            let brands = args[1];
            let advertItems = args[2];
            var vue = vue_ext_1.createVueInstance({
                el: page.mainView,
                data: { products: products, brands: brands, advertItems: advertItems },
                mounted: function () {
                    let e = page.element.querySelector('[name="ad-swiper"]');
                    console.assert(e != null);
                    var c = new Carousel(e, { autoplay: true });
                }
            });
        });
        return result;
    });
});
