define(["require", "exports", 'chitu.mobile', 'services'], function (require, exports, chitu_mobile_1, services) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action((page) => {
        let { id } = page.routeData.values;
        let result = services.home.getProduct(id).then((product) => {
            let vm = new Vue({
                el: page.mainView,
                data: {
                    product: product
                }
            });
        });
        return result;
    });
});
