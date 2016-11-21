"use strict";

define(["require", "exports", 'chitu.mobile', 'services'], function (require, exports, chitu_mobile_1, services) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        var id = page.routeData.values.id;

        var result = services.home.getProduct(id).then(function (product) {
            var vm = new Vue({
                el: page.mainView,
                data: {
                    product: product
                }
            });
        });
        return result;
    });
});
