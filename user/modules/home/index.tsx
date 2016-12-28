import { Page } from 'chitu.mobile';
import { app } from 'site';
import * as services from 'services';
import * as ui from 'core/ui';
import Carousel = require('carousel');
import Vue = require('vue');
import 'controls/dataList';
import 'controls/imageBox';

export default function (page: Page) {

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

    requirejs(['text!pages/home/index.html'], function (html) {
        page.dataView.innerHTML = html;

        new Vue({
            el: page.dataView,
            data,
            mounted() {
                q.then(() => {
                    let c = new Carousel(page.dataView.querySelector('[name="ad-swiper"]') as HTMLElement);
                })
            },
            methods: {
                loadProducts(pageIndex: number, reslove: Function) {
                    services.home.proudcts(pageIndex).then(items => reslove(items));
                }
            }
        });
    })



    createHeader(page);


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