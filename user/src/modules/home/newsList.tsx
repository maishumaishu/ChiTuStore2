import { Page } from 'chitu.mobile';
import * as services from 'services';
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {

    page.dataView.innerHTML = `
<div class="container">
    <data-list ref="newsList" v-on:load="newsListLoad">
        <template scope="props">
            <a class="item" :href="'#home_news?id=' + props.item.Id">
                <image-box :src="props.item.ImgUrl" class="img-responsive"></image-box>
                <div class="title">{{ props.item.Title }}</div>
            </a>
        </template>
    </data-list>
</div>`;

    new Vue({
        el: page.dataView,
        methods: {
            newsListLoad(pageIndex: number, reslove: Function, reject: Function) {
                services.station.newsList(pageIndex)
                    .then(items => {
                        if (pageIndex == 0)
                            page.loadingView.style.display = 'none';

                        pageIndex = pageIndex + 1;
                        reslove(items)
                    })
                    .catch(err => reject(err));
            }
        },
    })

    createHeader(page);
}

function createHeader(page: Page) {
    new Vue({
        el: page.header,
        render(h) {
            return (
                <header>
                    <nav class="bg-primary" style="width:100%;">
                        <h4>微资讯</h4>
                    </nav>
                </header>
            );
        }
    })
}
