import { Page } from 'chitu.mobile';
import * as services from 'services';
import Vue = require('vue');

export default function (page: Page) {
    page.load.add(() => {
        page.loadingView.style.display = 'none';
        new Vue({
            el: page.dataView,
            data: {
                dataSource: []
            },
            mounted: function () {
            },
            methods: {
                newsListLoad(pageIndex: number, reslove: Function, reject: Function) {
                    services.home.newsList(pageIndex)
                        .then(items => reslove(items))
                        .catch(err => reject(err));
                }
            }
        })
    })
}