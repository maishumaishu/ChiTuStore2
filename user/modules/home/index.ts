import { Page } from 'chitu.mobile';
import * as services from 'services';
import * as ui from 'core/ui';
import Carousel = require('carousel');
import Vue = require('vue');

export default function (page: Page) {

    let advertItems = [];
    let products = [];
    let data = { products, advertItems };
    let pageIndex = 0;

    let q = Promise.all([services.home.advertItems(), services.home.proudcts(pageIndex)])
        .then(result => {
            data.advertItems = result[0];
            data.products = result[1];
            page.loadingView.style.display = 'none';
            pageIndex = pageIndex + 1;
        });

    page.load.add(() => {
        new Vue({
            el: page.dataView,
            data,
            mounted() {
                q.then(() => {
                    let c = new Carousel(page.dataView.querySelector('[name="ad-swiper"]') as HTMLElement);
                })
            }
        });


        ui.scrollOnBottom(page.dataView, function () {
            services.home.proudcts(pageIndex).then(items => {
                items.forEach(o => data.products.push(o));
                pageIndex = pageIndex + 1;
            });
        });

    });
};
