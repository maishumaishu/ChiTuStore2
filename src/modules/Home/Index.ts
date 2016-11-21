import { Page, action } from 'chitu.mobile';
import * as services from 'services';
//import Vue = require('vue');
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page) {
    let result = Promise.all([services.home.proudcts(), services.home.brands(), services.home.advertItems()])
        .then((args) => {
            let products = args[0];
            let brands = args[1];
            let advertItems = args[2];

            var vue = createVueInstance({
                el: page.mainView,
                data: { products, brands, advertItems },
                mounted: function () {
                    let e = page.element.querySelector('[name="ad-swiper"]') as HTMLElement;
                    console.assert(e != null);
                    var c = new Carousel(e, { autoplay: true });
                }
            });

        });

    return result;
});
