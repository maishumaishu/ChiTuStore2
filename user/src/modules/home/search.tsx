import { Page } from 'site';
import { StationService } from 'services';

export default function (page: Page) {
    let station = page.createService(StationService);
    let data = {
        historyKeywords: new Array<string>(),
        searchKeyWords: Array<string>(),
    };

    let methods = {
        clearHistoryKeywords() {

        }
    }

    station.searchKeywords().then(items => {
        data.searchKeyWords = items;
        page.loadingView.style.display = 'none';
    });

    let vm = new Vue({
        el: page.dataView,
        data,
        computed: {
            visible() {

            }
        },
        mounted() {
            //page.element.appendChild(this.$el);
            //(page.header.querySelector('input') as HTMLInputElement).focus();
        },
        render(h) {
            return (
                <section style={{ backgroundColor: '#fff' }} class="main container">
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
                            ProductId         <div class="button">
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
    })

    createHeader(page);

    function createHeader(page: Page) {
        let vm = new Vue({
            el: page.header,
            updated() {
                let input = vm.$el.querySelector('input');
            },
            render: function (h) {
                return (
                    <header>
                        <nav style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
                            <button on-click={() => window['app'].back()} class="leftButton">
                                <i class="icon-chevron-left"></i>
                            </button>
                            <form action="" class="input-group" style="display: table; padding: 8px 10px 0 0;">
                                <input type="search" class="form-control" />
                                <span class="input-group-btn"><button type="button" class="btn btn-default">搜索</button></span>
                            </form>
                        </nav>
                    </header>
                );
            }
        });

        //======================================================
        // 注：在 ios safari 下无效
        vm.$nextTick(() => (page.header.querySelector('input') as HTMLInputElement).focus());
        //======================================================
    }
}