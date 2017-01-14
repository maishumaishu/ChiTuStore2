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
    });

    vm.$nextTick(() => {
        let header = page.element.querySelector('header') as HTMLElement;
        let nav = page.element.querySelector('header nav') as HTMLElement;
        let dataViewElement = page.dataView;
        dataViewElement.addEventListener('scroll', function () {
            let p = vm.$el.scrollTop / 100;
            p = p > 1 ? 1 : p;
            nav.style.opacity = `${p}`;
        });

        let touchStartY: number;
        let touchstartX: number;
        dataViewElement.addEventListener('touchstart', function (event) {
            touchStartY = event.touches[0].clientY;
            touchstartX = event.touches[0].clientX;
        });

        dataViewElement.addEventListener('touchmove', function (event) {
            let touchCurrentY = event.touches[0].clientY;
            let touchCurrentX = event.touches[0].clientX;
            let y = touchCurrentY - touchStartY;
            let x = touchCurrentX - touchstartX;
            //=====================================================
            // 计算角度，大于 65 度为竖直方向
            let d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
            if (dataViewElement.scrollTop <= 0 && d > 65) {
                header.style.display = 'none';
            }
            else {
                header.style.display = 'block';
            }
        });

        dataViewElement.addEventListener('touchend', function (event) {
            header.style.display = 'block';
        })
    });

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
                        <nav class="bg-primary"></nav>
                        <nav>
                            <a href="#user_messages" class="left-icon">
                                <i class="icon-map-marker">
                                </i>
                                <div>上海</div>
                            </a>
                            <a href="#user_messages" class="right-icon">
                                <i class="icon-comments-alt">
                                </i>
                                <div>消息</div>
                            </a>
                            <a href="#home_search" class="search-input form-control input-sm">
                                <span>寻找商品、品牌、品类</span>
                                <i class="icon-search"></i>
                            </a>
                        </nav>
                    </header>
                );


                return defaultHeader;

            }
        })
    }

};