import Vue = require('vue');
import { Page } from 'chitu.mobile';
import { shop, imageUrl, shoppingCart } from 'services';
import * as site from 'site'
import { PageViewGesture, imageDelayLoad } from 'core/ui'
import { mapGetters } from 'vuex';
import * as ui from 'core/ui';

import 'controls/imageBox';

export default async function (page: Page) {
    let { id } = page.routeData.values

    let result = await Promise.all([chitu.loadjs(`text!pages/home/product.html`), shop.product(id)]);//.then(function (result) {
    let html = result[0];
    let product = result[1];

    page.dataView.innerHTML = html;
    let vm = new Vue({
        el: page.dataView,
        data: {
            product
        },
        computed: {
            productSelectedText
        },
        mounted
    });

    function productSelectedText() {
        var str = '';
        var props = product.CustomProperties;
        for (var i = 0; i < props.length; i++) {
            var options = props[i].Options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].Selected) {
                    str = str + options[j].Name + ' ';
                    break;
                }
            }
        }
        str = str + product.Count + '件';
        return str;
    }

    async function mounted() {

        let introduceView = createIntroduceView(page);
        let introduceView2 = createHorizontalIntroduceView(page);
        page.element.appendChild(introduceView);
        page.element.appendChild(introduceView2);
        let pageView = new PageViewGesture({
            element: page.dataView,
            right: { element: introduceView2 },
            bottom: { element: introduceView }
        });

        page.loadingView.style.display = 'none';
    }

    vm.$nextTick(function () {
        createHeader(page);
        createFooter(page);
    });

    function createHeader(page: Page) {
        type ModelMethods = {
            favor: Function
        }
        let methods: ModelMethods = {
            favor: ui.buttonOnClick(function (event) {
                if (product.IsFavored) {
                    return shop.unfavorProduct(product.Id).then(() => {
                        product.IsFavored = false;
                    })
                }

                return shop.favorProduct(product.Id).then(() => {
                    product.IsFavored = true;
                });
            })
        }
        new Vue({
            el: page.header,
            methods,
            render(h) {
                let model = this as ModelMethods;
                return (
                    <header>
                        <nav class="bg-primary" style="width:100%;">
                            <button name="back-button" onclick="app.back()" class="leftButton">
                                <i class="icon-chevron-left"></i>
                            </button>
                            <h4>商品信息</h4>
                            <button class="rightButton" on-click={model.favor}>
                                <i class="icon-heart-empty" style={{ fontWeight: `800`, fontSize: `20px`, display: product.IsFavored ? 'none' : 'block' }} ></i>
                                <i class="icon-heart" style={{ display: product.IsFavored ? 'block' : 'none' }}></i>
                            </button>
                        </nav>
                    </header>
                );
            }
        })
    }

}

function createIntroduceView(page: Page) {
    let introduceView = document.createElement('section');
    introduceView.style.display = 'none';
    introduceView.style.paddingTop = '0px';

    let { id } = page.routeData.values
    let loadIntroduce = shop.productIntroduce(id);

    chitu.loadjs('text!pages/home/product/introduce.html').then(html => {
        introduceView.innerHTML = html;
        loadIntroduce.then(o => {
            let introduceElement = introduceView.querySelector('.container') as HTMLElement;
            introduceElement.innerHTML = o;
            let imgs = introduceElement.querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                let img = imgs.item(i) as HTMLImageElement;
                img.src = imageUrl(img.src);
                imageDelayLoad(img, site.config.imageText);
            }
        });
    })

    return introduceView;
}

function createHorizontalIntroduceView(page: Page) {
    let introduceView = document.createElement('section');

    let introduceContent = document.createElement('div');
    introduceContent.className = 'container';
    introduceView.appendChild(introduceContent);

    let { id } = page.routeData.values
    let loadIntroduce = shop.productIntroduce(id);

    loadIntroduce.then(o => {
        introduceContent.innerHTML = o;
        let imgs = introduceContent.querySelectorAll('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs.item(i) as HTMLImageElement;
            img.src = imageUrl(img.src);
            imageDelayLoad(img, site.config.imageText);
        }
    });

    return introduceView;
}


function createFooter(page: Page) {
    let data = {
        productStock: 0
    }

    let productId = page.routeData.values.id;
    //let state = services.shoppingCart.store.state;

    type ModelComputed = {
        itemsCount: () => number
    }

    type ModelMethods = {
        addToShoppingCart: Function
    }

    let computed: ModelComputed = {
        itemsCount: shoppingCart.productsCount
    }

    let methods: ModelMethods = {
        addToShoppingCart: ui.buttonOnClick(function (event) {
            return shoppingCart.addItem(productId);
        })
    }

    let vm = new Vue({
        el: page.footer,
        computed,
        methods,
        render(h) {
            let model = this as (ModelComputed & ModelMethods);
            return (
                <footer>
                    <nav name="bottom_bar" class="">
                        <span name="btn_shopping_cart" class="pull-left">
                            <i class="icon-shopping-cart"></i>
                            <span class="badge bg-primary" style={{ display: model.itemsCount ? 'block' : 'none' }}>{model.itemsCount}</span>
                        </span>
                        <button name="btn_add" class="btn btn-primary pull-right" on-click={model.addToShoppingCart}>加入购物车</button>
                    </nav>
                </footer >
            );

        }
    })

    return data;
}
