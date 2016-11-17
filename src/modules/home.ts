import { Page, action } from 'core/chitu.mobile';
import * as services from 'services';
import Vue = require('vue');

export default action(function (page: Page) {
    return Promise.all([services.home.proudcts(), services.home.brands()])
        .then((args) => {
            let products = args[0];
            let brands = args[1];
            window.setTimeout(() => {
                var app = new Vue({
                    el: '.view',
                    data: { products, brands }
                });
            }, 10);
            // return Promise.resolve();
        });
});