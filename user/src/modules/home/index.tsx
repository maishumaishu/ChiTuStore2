import { Page } from 'chitu.mobile';
import { app } from 'site';
import * as services from 'services';
import * as ui from 'core/ui';
import Carousel = require('carousel');
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default async function (page: Page) {

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
    let q = services.station.advertItems().then(items => {
        data.advertItems = items;
        page.loadingView.style.display = 'none';
        pageIndex = pageIndex + 1;
    })

    createHeader(page);

    let result = await Promise.all([services.station.advertItems(), chitu.loadjs('text!pages/home/index.html')]);
    //.then(result => {
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
                services.home.proudcts(pageIndex).then(items => reslove(items));
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
                        <nav class="bg-primary">
                            <img class="logo" src="images/logo_main.png" />
                            <div class="search" on-click={() => methods.showSearchView()}>
                                <div name="search_input" data-bind="value: name" type="text" class="form-control" style="border-width:0px;border-radius:4px;">
                                    寻找商品、品牌、品类
                            </div>
                            </div>
                            <div class="search-icon">
                                <i class="icon-search" style=""></i>
                            </div>
                            <a href="#User_Messages" style="" class="right-icon">
                                <i class="icon-comments-alt">
                                </i>
                                <div style="">消息</div>
                            </a>
                            <div class="clearfix"></div>
                        </nav>
                    </header>
                );


                return defaultHeader;

            }
        })
    }

};