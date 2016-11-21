"use strict";

define(["require", "exports", 'chitu.mobile', 'services'], function (require, exports, chitu_mobile_1, services) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action(function (page) {
        var id = page.routeData.values.id;

        return Promise.all([services.home.getProduct(id), chitu.loadjs('Controls/ImageView')]).then(function (results) {
            var product = results[0];
            var vm = new Vue({
                el: page.mainView,
                data: {
                    product: product
                },
                computed: {
                    productSelectedText: function productSelectedText() {
                        var str = '';
                        var props = product.CustomProperties;
                        for (var i = 0; i < props.length; i++) {
                            var options = props[i].Options;
                            for (var j = 0; j < options.length; j++) {
                                if (options[j].Selected) {
                                    str = str + options[j].Name + ' ';
                                    break;
                                }
                            }
                        }
                        str = str + product.Count + '件';
                        return str;
                    }
                }
            });
        });
    });
});
