import { Page, action } from 'chitu.mobile';
import * as services from 'services';
//import * from 'vue.ext'

export default function (page: Page) {

    type TabType = 'offShelve' | 'onShelve' | 'all';
    let data = {
        name: 'testsfs',
        products: new Array(),
        type: null as TabType,
        isLoading: false,
    };

    loadProducts('all').then(result => {
        page.loadingView.style.display = 'none';
    });

    page.load.add(() => {
        let vm = new Vue({
            el: page.mainView,
            data,
            methods: {
                offShelve: function () {
                    return loadProducts('offShelve');
                },
                onShelve: function () {
                    return loadProducts('onShelve');
                },
                allProducts: function () {
                    return loadProducts('all');
                }
            }
        });
    });

    function loadProducts(type: 'onShelve' | 'offShelve' | 'all') {
        Vue.set(data, 'products', []);
        data.type = type;
        data.isLoading = true;
        return services.shop.products(type).then(result => {
            data.isLoading = false;
            Vue.set(data, 'products', result);
        });
    }
};

