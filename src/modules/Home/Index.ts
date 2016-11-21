import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page) {

    let pageLoad = new Promise((reslove, reject) => {
        page.load.add(() => reslove());
    });


    let data = { products: [], advertItems: [] };
    var productLoad = Promise.all([services.home.proudcts(), pageLoad, chitu.loadjs('Controls/PromotionLabel')])
        .then(result => {
            let items = result[0];
            items.forEach(o => data.products.push(o));
            new Vue({ el: page.mainView, data });
        });

    Promise.all([services.home.advertItems(), productLoad]).then((result) => {
        let advertItems = result[0];
        advertItems.forEach(o => data.advertItems.push(o));
        //====================================
        // DOM 更新需要时间，所以延时
        window.setTimeout(() => {
            let c = new Carousel(page.element.querySelector('[name="ad-swiper"]') as HTMLElement);
        }, 10);
        //====================================
    });

    return productLoad;
});
