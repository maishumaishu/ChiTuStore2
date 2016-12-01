import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page, pageLoadPromise) {

    let data = {
        user: {
            mobile: '',
            password: '',
        }
    }

    // return new Promise((reslove, reject) => {
    //     window.setTimeout(() => reslove(), 3000);
    // })

});
