import { Page } from 'chitu.mobile';
import Vue = require('vue');
import * as services from 'services';
import 'controls/imageBox';

export default function (page: Page) {
    let cateoriesPromise = services.shop.cateories();
    page.load.add(() => {
        let vm = new Vue({
            el: page.dataView,
            data: {
                cateories: []
            }
        });
        cateoriesPromise.then(items => {
            vm.cateories = items;
            page.loadingView.style.display = 'none';
        })
    })
}