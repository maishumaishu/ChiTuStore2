import { Page, action } from 'chitu.mobile';
import * as services from 'services';
//import * from 'vue.ext'

export default function (page: Page) {

    let data = {
        name: 'testsfs',
        products: new Array()
    };

    allProducts().then(result => {
        page.loadingView.style.display = 'none';
    });

    page.load.add(() => {
        let vm = new Vue({
            el: page.mainView,
            data,
            methods: {
                offShelve,
                onShelve,
                allProducts
            }
        });
        debugger;
    });

    function offShelve() {
        Vue.set(data, 'products', []);
        return services.shop.products('offShelve').then(result => {
            Vue.set(data, 'products', result);
        });
    }

    function onShelve() {
        Vue.set(data, 'products', []);
        return services.shop.products('onShelve').then(result => {
            Vue.set(data, 'products', result);
        });
    }

    function allProducts() {
        Vue.set(data, 'products', []);
        return services.shop.products().then(result => {
            Vue.set(data, 'products', result);
        });
    }
};

function page_load(page: Page) {

}