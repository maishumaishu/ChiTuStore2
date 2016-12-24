import Vue = require('vue');
import { Page } from 'chitu.mobile';
import * as services from 'services';
import * as site from 'site'
import { PageViewGesture, imageDelayLoad } from 'core/ui'
import Hammer = require('hammer');
import 'controls/imageBox';

export default async function (page: Page) {
    let { id } = page.routeData.values

    let result = await Promise.all([chitu.loadjs(`text!pages/home/product.html`), services.home.getProduct(id)]);//.then(function (result) {
    let html = result[0];
    let product = result[1];

    page.dataView.innerHTML = html;

    //let node = page.dataView;
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
    //})



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

    // vm.$nextTick(() => {
    //     page.loadingView.style.display = 'none';
    // });

    createHeader(page);
    createFooter(page);
}

function createIntroduceView(page: Page) {
    let introduceView = document.createElement('section');
    introduceView.style.display = 'none';
    introduceView.style.paddingTop = '0px';

    let { id } = page.routeData.values
    let loadIntroduce = services.shop.productIntroduce(id);

    chitu.loadjs('text!pages/home/product/introduce.html').then(html => {
        introduceView.innerHTML = html;
        loadIntroduce.then(o => {
            let introduceElement = introduceView.querySelector('.container') as HTMLElement;
            introduceElement.innerHTML = o;
            let imgs = introduceElement.querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                let img = imgs.item(i) as HTMLImageElement;
                img.src = services.imageUrl(img.src);
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
    let loadIntroduce = services.shop.productIntroduce(id);

    loadIntroduce.then(o => {
        introduceContent.innerHTML = o;
        let imgs = introduceContent.querySelectorAll('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs.item(i) as HTMLImageElement;
            img.src = services.imageUrl(img.src);
            imageDelayLoad(img, site.config.imageText);
        }
    });

    return introduceView;
}

function createHeader(page: Page) {
    new Vue({
        el: page.header,
        render(h) {
            return (
                <header>
                    <nav class="bg-primary" style="width:100%;">
                        <a name="back-button" href="javascript:app.back()" class="leftButton" style="padding-right:20px;padding-left:20px;margin-left:-20px;">
                            <i class="icon-chevron-left"></i>
                        </a>
                        <h4>商品信息</h4>
                    </nav>
                </header>
            );
        }
    })
}

function createFooter(page: Page) {
    let data = {
        productStock: 0
    }
    new Vue({
        el: page.footer,
        render(h) {
            return (
                <footer>
                    <nav name="bottom_bar" class="">
                        <span name="btn_shopping_cart" class="pull-left">
                            <i class="icon-shopping-cart"></i>
                            <span class="badge bg-primary">6</span>
                        </span>
                        <button name="btn_add" class="btn btn-primary pull-right">加入购物车</button>
                    </nav>
                </footer>
            );
        }
    })
    return data;
}
