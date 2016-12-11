import { Application, Page, action } from 'chitu.mobile';
import * as services from 'services';
import { app } from 'site';

export default function (page: Page) {
    let data = {
        orders: []
    }

    services.shop.orders().then(result => {
        for (let i = 0; i < result.dataItems.length; i++)
            data.orders.push(result.dataItems[i]);

        page.loadingView.style.display = 'none';
    });

    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data
        })
    });
}

