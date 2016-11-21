import { Page, action } from 'chitu.mobile';
import * as services from 'services';

export default action((page: Page) => {
    let { id } = page.routeData.values
    // let data = { product: {} };

    return Promise.all([services.home.getProduct(id), chitu.loadjs('Controls/ImageView')]).then(results => {
        let product = results[0];
        let vm = new Vue({
            el: page.mainView,
            data: {
                product
            },
            computed: {
                productSelectedText: function () {
                    //let product = this.product;
                    var str = '';
                    var props = product.CustomProperties; //mapping.toJS(this.CustomProperties);
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
                    //return 'helloWorld';
                }
            }
        })
    });
});