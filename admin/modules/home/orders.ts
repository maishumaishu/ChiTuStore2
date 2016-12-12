import { Application, Page, action } from 'chitu.mobile';
import * as services from 'services';
import { app } from 'site';

export default function (page: Page) {
    type TabType = 'all' | 'Send' | 'Paid' | 'WaitingForPayment';
    let data = {
        orders: [],
        type: null as TabType,
    }

    loadOrders('all');
    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data,
            methods: {
                all: function () {
                    return loadOrders('all');
                },
                Paid: function () {
                    return loadOrders('Paid');
                },
                WaitingForPayment: function () {
                    return loadOrders('WaitingForPayment');
                },
                Send: function () {
                    return loadOrders('Send');
                }
            }
        })
    });
    function loadOrders(type: 'all' | 'Send' | 'Paid' | 'WaitingForPayment') {
        data.type = type;
        services.shop.orders(type).then(result => {
            for (let i = 0; i < result.dataItems.length; i++)
                data.orders.push(result.dataItems[i]);
            page.loadingView.style.display = 'none';
        });
    }
}

