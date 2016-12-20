import { Page } from 'chitu.mobile';
import * as services from 'services';
import * as ui from 'core/ui';
import Carousel = require('carousel');
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {

    let advertItems = [];
    let data = { advertItems };
    let pageIndex = 0;

    let q = services.home.advertItems().then(items => {
        data.advertItems = items;
        page.loadingView.style.display = 'none';
        pageIndex = pageIndex + 1;
    })

    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data,
            mounted() {
                q.then(() => {
                    let c = new Carousel(page.dataView.querySelector('[name="ad-swiper"]') as HTMLElement);
                })
            },
            methods: {
                loadProducts(pageIndex: number, reslove: Function) {
                    services.home.proudcts(pageIndex).then(items => reslove(items));
                }
            }
        });


        // ui.scrollOnBottom(page.dataView, function () {
        //     services.home.proudcts(pageIndex).then(items => {
        //         items.forEach(o => data.products.push(o));
        //         pageIndex = pageIndex + 1;
        //     });
        // });

    });
};
