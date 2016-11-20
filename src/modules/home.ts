import { Page, action } from 'core/chitu.mobile';
import * as services from 'services';
import Vue = require('vue');

export default action(function (page: Page) {
    let result = Promise.all([services.home.proudcts(), services.home.brands(), services.home.advertItems()])
        .then((args) => {
            let products = args[0];
            let brands = args[1];
            let advertItems = args[2];

            var vue = new Vue({
                el: page.mainView,
                data: { products, brands, advertItems },
            });
        });

    return result;

});
