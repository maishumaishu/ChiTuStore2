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
        pageIndex: 0,
        loadComplete: false,
    };

    loadProducts('all', 0).then(result => {
        page.loadingView.style.display = 'none';
    });

    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data,
            methods: {
                offShelve: function () {
                    return reloadProduct('offShelve');
                },
                onShelve: function () {
                    return reloadProduct('onShelve');
                },
                allProducts: function () {
                    return reloadProduct('all');
                }
            },
            mounted: function () {
                let vm = this as VueInstance;
                scrollOnBottom(vm.$el, function () {
                    if (data.loadComplete)
                        return;

                    return loadProducts(data.type, data.pageIndex + 1).then((isLoadComplete) => {
                        data.pageIndex = data.pageIndex + 1;
                        data.loadComplete = isLoadComplete;
                    });
                })
            }
        });
    });

    function reloadProduct(type: TabType) {
        Vue.set(data, 'products', []);
        data.loadComplete = false;
        return loadProducts(type, 0);
    }

    function scrollOnBottom(element: HTMLElement, callback: Function) {
        console.assert(element != null);
        console.assert(callback != null);

        element.addEventListener('scroll', function () {
            let maxScrollTop = element.scrollHeight - element.clientHeight;
            let deltaHeight = 10;
            if (element.scrollTop + deltaHeight >= maxScrollTop) {
                let loadPrmoise = callback();
                console.assert(loadPrmoise != null);
            }
        });
    }

    function loadProducts(type: 'onShelve' | 'offShelve' | 'all', pageIndex: number) {
        data.type = type;
        data.isLoading = true;
        return services.shop.products(type, pageIndex).then(result => {
            data.isLoading = false;
            result.dataItems.forEach(o => data.products.push(o));
            return result.loadComplete;
        });
    }
};

