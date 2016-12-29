import { Page } from 'chitu.mobile';
import Vue = require('vue');
import { shoppingCart } from 'services';
import 'controls/imageBox';

export default function (page: Page) {

    let data = {
        items: Array<shoppingCart.Item>()
    };

    let methods = {
        decreaseCount: function (item: shoppingCart.Item) {
            item.Count = item.Count - 1;
        },
        increaseCount: function (item: shoppingCart.Item) {
            item.Count = item.Count + 1;
        },
        selectItem: function (item: shoppingCart.Item) {
            item.Selected = !item.Selected;
        }
    };

    let vm = new Vue({
        el: page.dataView,
        data,
        render,
        methods
    });

    shoppingCart.items().then(items => {
        vm.items = items;
        page.loadingView.style.display = 'none';
    });

    function render(h) {
        return (
            <section class="main container">
                <ul class="list-group">
                    {data.items.map(o =>
                        <li class="list-group-item row">
                            <div class="pull-left icon">
                                <i on-click={() => methods.selectItem(o)} class={o.Selected ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
                            </div>
                            <a href={"#home_product?id="+o.ProductId} class="pull-left pic">
                                <image-box src={o.ImageUrl} class="img-responsive" />
                            </a>
                            <div style="margin-left:110px;">
                                <a href={"#home_product?id="+o.ProductId} >{o.Name}</a>
                                <div>
                                    <div class="price pull-left" style="margin-top:10px;">￥{o.Price.toFixed(2)}</div>
                                    <div class="pull-right">
                                        <div data-bind="visible:!ko.unwrap(IsGiven)" class="input-group" style="width:120px;">
                                            <span on-click={() => methods.decreaseCount(o)} class="input-group-addon">
                                                <i class="icon-minus"></i>
                                            </span>
                                            <input value={o.Count} class="form-control" type="text" style="text-align:center;" />
                                            <span on-click={() => methods.increaseCount(o)} class="input-group-addon">
                                                <i class="icon-plus"></i>
                                            </span>
                                        </div>
                                        <div>
                                            <span data-bind="visible:IsGiven,text:'X ' + ko.unwrap(Count)" style="padding-left: 6px; display: none;">X 3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </section>
        );
    };

    createHeader(page);
}

function createHeader(page: Page) {
    new Vue({
        el: page.header,
        render(h) {
            return (
                <header>
                    <nav class="bg-primary" style="width:100%;">
                        <h4>购物车</h4>
                    </nav>
                </header>
            );
        }
    })
}