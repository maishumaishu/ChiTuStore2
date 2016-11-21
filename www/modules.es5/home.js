"use strict";

define(["require", "exports", 'chitu.mobile', 'services', 'vue'], function (require, exports, chitu_mobile_1, services, Vue) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        var result = Promise.all([services.home.proudcts(), services.home.brands(), services.home.advertItems()]).then(function (args) {
            var products = args[0];
            var brands = args[1];
            var advertItems = args[2];
            var vue = new Vue({
                el: page.mainView,
                data: { products: products, brands: brands, advertItems: advertItems }
            });
        });
        return result;
    });
});
