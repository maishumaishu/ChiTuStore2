import { Page, defaultTitleBar } from 'site';
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
                        { defaultTitleBar(h, title) }
                        <ul class="tabs" style="margin: 0px;">
                            <li>
                                <a data-bind="click:sort,tap:sort, attr:{class: queryArguments.sort() ? '' : 'active'}" data-type="Default" class="active">综合</a>
                            </li>
                            <li>
                                <a data-bind="click:sort,tap:sort, attr:{class: queryArguments.sort().substr(0, 'SalesNumber'.length) == 'SalesNumber' ? 'active' : ''}" data-type="SalesNumber" class="">销量</a>
                            </li>
                            <li>
                                <a data-bind="click:sort, tap: sort, attr:{class: queryArguments.sort().substr(0, 'Price'.length) == 'Price' ? 'active' : ''}" data-type="Price" class="">
                                    价格
                                    <span data-bind="visible: queryArguments.sort().substr('Price'.length + 1) == 'asc'" class="glyphicon glyphicon-triangle-top" style="display: none;"></span>
                                    <span data-bind="visible: queryArguments.sort().substr('Price'.length + 1) == 'desc'" class="glyphicon glyphicon-triangle-bottom" style="display: none;"></span>
                                </a>
                            </li>
                        </ul>
                    </header>
                );
                //return defaultHeader(h, title);
            }
        })
    }
}