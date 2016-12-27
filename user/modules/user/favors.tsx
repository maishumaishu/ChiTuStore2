import { Page } from 'chitu.mobile';
import Vue = require('vue');
import { shop } from 'services';
import * as ui from 'core/ui';
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {
    page.dataView.innerHTML = `
    <div class="container">
        <data-list @load="loadFavorProducts">
            <template scope="props">
            <div class="item">
                <div @click="showProduct(props.item.ProductId)" class="col-xs-4">
                    <image-box :src="props.item.ImageUrl" class="img-responsive"/>
                </div>
                <div class="col-xs-8">
                    <div @click="showProduct(props.item.ProductId)" class="name">
                        <div>{{props.item.ProductName}}</div>
                    </div>
                    <button @click="unfavore($event,props.item)" class="pull-right" :style="{display: props.item.Status == 'favor' ? 'block' : 'none'}">
                        <i class="icon-heart"></i> 取消收藏
                    </button>
                    <label class="pull-right" :style="{display: (props.item.Status == 'unfavor' ? 'block' : 'none')}">
                        已取消
                    </label>
                </div>
                <div class="clearfix"></div>
            </div>
            <hr class="row">
            </template>
        </data-list>
    </div>`;
    let vm = new Vue({
        el: page.dataView,
        methods: {
            showProduct(productId: string) {
                debugger;
            },
            loadFavorProducts(pageIndex: number, reslove: Function) {
                shop.favorProducts().then(items => {
                    if (pageIndex > 0) {
                        reslove([]);
                        return;
                    }

                    items.forEach(o => o['Status'] = 'favor')
                    reslove(items);

                    page.loadingView.style.display = 'none';
                });
            },
            // unfavore: function (event, productId: string) {
            //     debugger;
            // }
            unfavore: ui.buttonOnClick((event, item: shop.FavorProduct) => {
                return shop.unfavorProduct(item.ProductId).then(() => {
                    item['Status'] = 'unfavor';
                });
            }),
        }
    });

    (page.header.querySelector('h4') as HTMLElement).innerHTML = '我的收藏';
}