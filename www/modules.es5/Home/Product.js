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
                },
                mounted: function mounted() {
                    on_mounted();
                }
            });
        });
        function on_mounted() {
            var pullUpBar = page.element.querySelector('.pull-up-bar');
            var beginTop = void 0;
            var currentTop = void 0;
            page.mainView.addEventListener('touchstart', function (event) {
                var rect = pullUpBar.getBoundingClientRect();
                beginTop = rect.top;
            });
            page.mainView.addEventListener('touchmove', function (event) {
                var rect = pullUpBar.getBoundingClientRect();
                currentTop = rect.top;
                var deltaTop = beginTop - currentTop;
                if (deltaTop > 20) {
                    pullUpBar.querySelector('.ready').style.display = 'block';
                    pullUpBar.querySelector('.init').style.display = 'none';
                } else {
                    pullUpBar.querySelector('.ready').style.display = 'none';
                    pullUpBar.querySelector('.init').style.display = 'block';
                }
            });
            page.mainView.addEventListener('touchend', function (event) {
                var deltaTop = currentTop - beginTop;
                pullUpBar.querySelector('.ready').style.display = 'none';
                pullUpBar.querySelector('.init').style.display = 'block';
            });
        }
    });
});
