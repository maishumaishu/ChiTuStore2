import { Page, action } from 'chitu.mobile';
import * as services from 'services';

export default function (page: Page) {

    let data = {
        name: 'testsfs',
        products: new Array()
    };

    let productsPromise = services.shop.products().then(result => {
        for (let i = 0; i < result.length; i++) {
            data.products.push(result[i]);
        }

        page.loadingView.style.display = 'none';
    });

    page.load.add(() => {
        new Vue({
            el: page.mainView,
            data,
        })
    });
};

function page_load(page: Page) {

}