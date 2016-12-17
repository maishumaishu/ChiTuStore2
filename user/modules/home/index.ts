import { Page } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');
import Vue = require('vue');

export default function (page: Page) {

    let advertItems = [];
    let products = [];
    let data = { products, advertItems };

    // var productLoad = Promise.all([])
    //     .then(result => {

    //     });

    // Promise.all([services.home.advertItems(), productLoad]).then((result) => {
    //     result[0].forEach(o => advertItems.push(o));
    //     //====================================
    //     // DOM 更新需要时间，所以延时
    //     window.setTimeout(() => {
    //         let c = new Carousel(page.element.querySelector('[name="ad-swiper"]') as HTMLElement);
    //     }, 10);
    //     //====================================
    // });

    // services.home.advertItems().then(result => {
    //     result.forEach(o => data.products.push(o));
    // });

    let q = Promise.all([services.home.advertItems(), services.home.proudcts()])
        .then(result => {
            result[0].forEach(o => advertItems.push(o));
            result[1].forEach(o => products.push(o));

            page.loadingView.style.display = 'none';
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
    });



    // return productLoad;
};
