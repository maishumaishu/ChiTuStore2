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

    let searchViewData = createSearchView(page);
    let methods = {
        showSearchView() {
            searchViewData.visible = true;
        },
        showDefaultView() {
            searchViewData.visible = false;
        },
        clearHistoryKeywords() {

        }
    }

    page.shown.add(() => {
        debugger;
        searchViewData.visible = false
    });

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
            methods: {
            },
            updated() {
                let input = vm.$el.querySelector('input');
                if (input)
                    input.focus();
            },
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
                let searchHeader = (
                    <header style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
                        <nav style="">
                            <span style="">
                                <a on-click={() => methods.showDefaultView()} class="pull-left left-button" style="padding: 14px 12px 0px 12px;">
                                    <i class="icon-chevron-left"></i>
                                </a>
                            </span>
                            <form action="" class="input-group" style="padding: 8px 10px 0 0;display: table;">
                                <input type="search" class="form-control" />
                                <span class="input-group-btn"><button type="button" class="btn btn-default">搜索</button></span>
                            </form>
                        </nav>
                    </header>
                );

                if (searchViewData.visible)
                    return searchHeader;

                return defaultHeader;

            }
        })
    }

    function createSearchView(page: Page) {
        let searchViewElement = document.createElement('section');
        page.element.appendChild(searchViewElement);
        let data = {
            historyKeywords: new Array<string>(), searchKeyWords: Array<string>(), visible: false
        };
        services.station.searchKeywords().then(items => {
            data.searchKeyWords = items;
        });

        let vm = new Vue({
            el: searchViewElement,
            data,
            computed: {
                visible() {

                }
            },
            mounted() {
                page.element.appendChild(this.$el);
            },
            render(h) {
                if (data.visible) {
                    return (
                        <section style={{ backgroundColor: '#fff' }} class="container">
                            <div class="clearfix">
                                {data.searchKeyWords.map(o => (
                                    <h2>
                                        <span class="label label-default" style="float:left;margin-right:8px;">
                                            {o}
                                        </span>
                                    </h2>
                                ))}
                            </div>

                            <hr class="row" />

                            <div class="history">
                                <h4>历史搜索</h4>
                                <hr class="row" />

                                <div style={{ display: data.historyKeywords.length > 0 ? 'block' : 'none' }}>
                                    <div class="button">
                                        <button on-click={methods.clearHistoryKeywords} class="btn btn-default btn-block">清除历史搜索记录</button>
                                    </div>
                                </div>


                                <div style={{ display: data.historyKeywords.length == 0 ? 'block' : 'none' }} class="norecords">
                                    <div class="user-favors norecords">
                                        <div class="icon">
                                            <i class="icon-search"></i>
                                        </div>
                                        <div class="text">你还没有历史搜索记录哦~~</div>
                                    </div>
                                </div>

                            </div>
                        </section>
                    );
                }

                return null;
            }
        })

        return data;
    }
};