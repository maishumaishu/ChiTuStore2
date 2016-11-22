define(["require", "exports", 'chitu.mobile', 'services'], function (require, exports, chitu_mobile_1, services) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = chitu_mobile_1.action((page) => {
        let { id } = page.routeData.values;
        return Promise.all([services.home.getProduct(id), chitu.loadjs('Controls/ImageView')]).then(results => {
            let product = results[0];
            let vm = new Vue({
                el: page.mainView,
                data: {
                    product: product
                },
                computed: {
                    productSelectedText: function () {
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
                mounted: () => {
                    on_mounted();
                }
            });
        });
        function on_mounted() {
            let pullUpBar = page.element.querySelector('.pull-up-bar');
            let beginTop;
            let currentTop;
            page.mainView.addEventListener('touchstart', function (event) {
                let rect = pullUpBar.getBoundingClientRect();
                beginTop = rect.top;
            });
            page.mainView.addEventListener('touchmove', function (event) {
                let rect = pullUpBar.getBoundingClientRect();
                currentTop = rect.top;
                let deltaTop = beginTop - currentTop;
                if (deltaTop > 20) {
                    pullUpBar.querySelector('.ready').style.display = 'block';
                    pullUpBar.querySelector('.init').style.display = 'none';
                }
                else {
                    pullUpBar.querySelector('.ready').style.display = 'none';
                    pullUpBar.querySelector('.init').style.display = 'block';
                }
            });
            page.mainView.addEventListener('touchend', function (event) {
                let deltaTop = currentTop - beginTop;
                pullUpBar.querySelector('.ready').style.display = 'none';
                pullUpBar.querySelector('.init').style.display = 'block';
            });
        }
    });
});
