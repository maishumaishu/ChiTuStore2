// import { Page } from 'chitu.mobile';
import { app, Page } from 'site';
import { ShopService, StationService } from 'services';
import * as ui from 'core/ui';
import Carousel = require('carousel');
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default async function (page: Page) {

    let station = page.createService(StationService);
    let shop = page.createService(ShopService);

    let searchKeyWords: Array<string> = [];
    let data = {
        advertItems: new Array<any>(),
    };

    let methods = {
        showSearchView() {
            app.redirect('home_search');
        }
    }

    let pageIndex = 0;
    let q = station.advertItems().then(items => {
        data.advertItems = items;
        page.loadingView.style.display = 'none';
        pageIndex = pageIndex + 1;
    })

    createHeader(page);

    let result = await Promise.all([station.advertItems(), chitu.loadjs('text!pages/home/index.html')]);
    data.advertItems = result[0];
    page.loadingView.style.display = 'none';
    pageIndex = pageIndex + 1;

    page.dataView.innerHTML = result[1];
    let vm = new Vue({
        el: page.dataView,
        data,
        mounted() {
        },
        methods: {
            loadProducts(pageIndex: number, reslove: Function) {
                station.proudcts(pageIndex).then(items => reslove(items));
            }
        }
    })

    vm.$nextTick(function () {
        let element = page.dataView.querySelector('[name="ad-swiper"]') as HTMLElement;
        let c = new Carousel(element);
        app.pageShown.add((sender, args) => {
            if (args.page.name != 'home.index') {
                c.stop();
            }
            else {
                c.play();
            }
        })
    })

    function createHeader(page: Page) {
        let vm = new Vue({
            el: page.header,
            data,
            render: function (h) {
                let defaultHeader = (
                    <header>
                        <nav>
                            <img class="logo" src="images/logo_main.png" />
                            <a href="#User_Messages" style="" class="right-icon">
                                <i class="icon-comments-alt">
                                </i>
                                <div style="">消息</div>
                            </a>
                            <div class="search" on-click={() => methods.showSearchView()}>
                                <div class="search-input form-control" data-bind="value: name">
                                    <span>寻找商品、品牌、品类</span>
                                    <i class="icon-search" style=""></i>
                                </div>
                            </div>
                        </nav>
                    </header>
                );


                return defaultHeader;

            }
        })
    }

};