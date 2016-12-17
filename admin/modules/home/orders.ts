import { Application, Page, action } from 'chitu.mobile';
import * as services from 'services';
import { app } from 'site';

export default function (page: Page) {
    type TabType = 'all' | 'send' | 'paid' | 'waitingForPayment';
    let data = {
        orders: [],
        type: null as TabType,
        isLoading: false,
        loadComplete: false,
        pageIndex: 0,
    }

    loadOrders('all').then(() => { page.loadingView.style.display = 'none'; });
    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data,
            mounted() {
                let vm = this as VueInstance;
                scrollOnBottom(vm.$el, async function () {
                    if (data.loadComplete)
                        return;
                    let isLoadComplete = await loadOrders(data.type);
                    data.pageIndex = data.pageIndex + 1;
                    data.loadComplete = isLoadComplete;
                })
            },
            methods: {
                all: function () {
                    return this.reloadOrders('all');
                },
                paid: function () {
                    return this.reloadOrders('paid');
                },
                waitingForPayment: function () {
                    return this.reloadOrders('waitingForPayment');
                },
                send: function () {
                    return this.reloadOrders('send');
                },
                reloadOrders: function (type: TabType) {
                    data.orders.length = 0;
                    data.loadComplete = false;
                    return loadOrders(type);
                }
            }
        })
    });
    function scrollOnBottom(element: HTMLElement, callback: Function) {
        console.assert(element != null);
        console.assert(callback != null);

        element.addEventListener('scroll', function () {
            let maxScrollTop = element.scrollHeight - element.clientHeight;
            let deltaHeight = 10;
            if (element.scrollTop + deltaHeight >= maxScrollTop) {
                callback();
            }
        });
    }
    async function loadOrders(type: 'all' | 'send' | 'paid' | 'waitingForPayment') {
        data.type = type;
        data.isLoading = true;
        let result = await services.shop.orders(type);
        data.orders = result.dataItems;
        data.isLoading = false;
        return result.loadComplete;
    }
}