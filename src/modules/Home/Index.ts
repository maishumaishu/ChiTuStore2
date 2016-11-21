import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page) {

    let data = { products: [], advertItems: [] };
    page.load.add(() => new Vue({ el: page.mainView, data }));

    services.home.advertItems().then((advertItems) => {
        advertItems.forEach(o => data.advertItems.push(o));
        //====================================
        // DOM 更新需要时间，所以延时
        window.setTimeout(() => {
            let c = new Carousel(page.element.querySelector('[name="ad-swiper"]') as HTMLElement);
        }, 10);
        //====================================
    });

    return Promise.all([services.home.proudcts(), chitu.loadjs('Controls/PromotionLabel')])
        .then(result => {
            let items = result[0];
            items.forEach(o => data.products.push(o));
        });

});
