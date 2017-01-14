import { Page, defaultNavBar } from 'site';
import { ShopService } from 'services';
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {

    let shop = page.createService(ShopService);

    page.dataView.innerHTML = `
<div class="row products" style="margin: 0px;">
  <data-list @load="loadProducts">
    <template scope="props">
      <a :href="'#home_product?id=' + props.item.Id" class="col-xs-6 text-center item">
        <image-box :src="props.item.ImageUrl"></image-box>
        <div class="bottom">
          <div class="interception">{{props.item.Name}}</div>
          <div>
            <div class="price pull-left">￥{{props.item.Price.toFixed(2)}}</div>
          </div>
        </div>
      </a>
    </template>
  </data-list>
</div>`;

    let categoryId = page.routeData.values.categoryId;
    let vm = new Vue({
        el: page.dataView,
        methods: {
            loadProducts(pageIndex, reslove) {
                shop.products(categoryId, pageIndex).then(items => {
                    if (pageIndex == 0) {
                        page.loadingView.style.display = 'none';
                        buildHeader(items[0].ProductCategoryName);

                    }
                    reslove(items);
                })
            }
        }
    });


    function buildHeader(title) {
        let vm = new Vue({
            el: page.header,
            render(h) {
                return (
                    <header>
                        {defaultNavBar(h, title)}
                        <ul class="tabs" style="margin: 0px;">
                            <li>
                                <a class="active">综合</a>
                            </li>
                            <li>
                                <a class="">销量</a>
                            </li>
                            <li>
                                <span>价格</span>
                                <span class="icon-angle-up"></span>
                            </li>
                        </ul>
                    </header>
                );
            }
        })
    }
}