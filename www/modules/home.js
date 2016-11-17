define(["require", "exports", 'core/chitu.mobile', 'services', 'vue'], function (require, exports, chitu_mobile_1, services, Vue) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        return Promise.all([services.home.proudcts(), services.home.brands()])
            .then((args) => {
            let products = args[0];
            let brands = args[1];
            window.setTimeout(() => {
                var app = new Vue({
                    el: '.view',
                    data: { products: products, brands: brands }
                });
            }, 10);
        });
    });
});
