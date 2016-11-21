define(["require", "exports", 'chitu.mobile', 'services', 'vue'], function (require, exports, chitu_mobile_1, services, Vue) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        let result = Promise.all([services.home.proudcts(), services.home.brands(), services.home.advertItems()])
            .then((args) => {
            let products = args[0];
            let brands = args[1];
            let advertItems = args[2];
            var vue = new Vue({
                el: page.mainView,
                data: { products: products, brands: brands, advertItems: advertItems },
            });
        });
        return result;
    });
});
