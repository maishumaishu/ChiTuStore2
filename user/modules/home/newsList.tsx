import { Page } from 'chitu.mobile';
import * as services from 'services';
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {

    page.dataView.innerHTML = 
`<div class="container">
    <data-list ref="newsList" v-on:load="newsListLoad">
        <template scope="props">
            <a class="item" href="'#home_news?id=' + props.item.Id">
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
                services.home.newsList(pageIndex)
                    .then(items => {
                        if (pageIndex == 0)
                            page.loadingView.style.display = 'none';

                        reslove(items)
                    })
                    .catch(err => reject(err));
            }
        },
    })
}
