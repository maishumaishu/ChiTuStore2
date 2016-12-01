import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page, pageLoadPromise) {

    let advertItems = [];
    var productLoad = Promise.all([services.home.proudcts(), pageLoadPromise, chitu.loadjs('Controls/PromotionLabel')])
        .then(result => {
            let products = result[0];
            let data = { products, advertItems };
            new Vue({ el: page.mainView, data });
        });

    Promise.all([services.home.advertItems(), productLoad]).then((result) => {
        result[0].forEach(o => advertItems.push(o));
        //====================================
        // DOM 更新需要时间，所以延时
        window.setTimeout(() => {
            let c = new Carousel(page.element.querySelector('[name="ad-swiper"]') as HTMLElement);
        }, 10);
        //====================================
    });



    return productLoad;
});
