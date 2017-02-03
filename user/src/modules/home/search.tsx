import { Page, searchNavBar, app } from 'site';
import { StationService } from 'services';

let { PageComponent, PageHeader, PageFooter, PageView, Button } = controls;

export default function (page: Page) {
    interface SearchPageState {
        // historyKeywords: Array<string>;
        // searchKeyWords: Array<string>;
    }

    let station = page.createService(StationService);

    class SearchPage extends React.Component<{ searchKeyWords: string[], historyKeywords: string[] }, SearchPageState> {
        constructor() {
            super();

        }

        private clearHistoryKeywords() {

        }

        render() {
            let searchKeyWords = this.props.searchKeyWords;
            let historyKeywords = this.props.historyKeywords;
            return (
                <PageComponent>
                    <PageHeader>
                        <nav style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
                            <button onClick={() => app.back()} className="leftButton">
                                <i className="icon-chevron-left"></i>
                            </button>
                            <form className="input-group" style={{ display: 'table', padding: '8px 10px 0 0' }}>
                                <input type="search" className="form-control" />
                                <span className="input-group-btn">
                                    <button type="button" className="btn btn-default">搜索</button>
                                </span>
                            </form>
                        </nav>
                    </PageHeader>
                    <PageView className="container">
                        <div className="clearfix">
                            {searchKeyWords.map((o, i) => (
                                <h2 key={i}>
                                    <span className="label label-default" style={{ float: "left", marginRight: 8 }}>
                                        {o}
                                    </span>
                                </h2>
                            ))}
                        </div>

                        <hr className="row" />

                        <div className="history">
                            <h4>历史搜索</h4>
                            <hr className="row" />

                            <div style={{ display: historyKeywords.length > 0 ? 'block' : 'none' }}>
                                <div className="button">
                                    <button onClick={() => this.clearHistoryKeywords()} className="btn btn-default btn-block">
                                        清除历史搜索记录
                                    </button>
                                </div>
                            </div>


                            <div style={{ display: historyKeywords.length == 0 ? 'block' : 'none' }} className="norecords">
                                <div className="user-favors norecords">
                                    <div className="icon">
                                        <i className="icon-search"></i>
                                    </div>
                                    <div className="text">你还没有历史搜索记录哦~~</div>
                                </div>
                            </div>

                        </div>
                    </PageView>
                </PageComponent>
            );
        }
    }

    station.searchKeywords().then(items => {
        // data.searchKeyWords = items;
        // page.loadingView.style.display = 'none';
        ReactDOM.render(<SearchPage searchKeyWords={items} historyKeywords={[]} />, page.element);
    });

}

// export default function (page: Page) {
//     let station = page.createService(StationService);
//     let data = {
//         historyKeywords: new Array<string>(),
//         searchKeyWords: Array<string>(),
//     };

//     let methods = {
//         clearHistoryKeywords() {

//         }
//     }

//     station.searchKeywords().then(items => {
//         data.searchKeyWords = items;
//         page.loadingView.style.display = 'none';
//     });

//     let vm = new Vue({
//         el: page.dataView,
//         data,
//         computed: {
//             visible() {

//             }
//         },
//         mounted() {
//             //page.element.appendChild(this.$el);
//             //(page.header.querySelector('input') as HTMLInputElement).focus();
//         },
//         render(h) {
//             return (
//                 <section style={{ backgroundColor: '#fff' }} class="main container">
//                     <div class="clearfix">
//                         {data.searchKeyWords.map(o => (
//                             <h2>
//                                 <span class="label label-default" style="float:left;margin-right:8px;">
//                                     {o}
//                                 </span>
//                             </h2>
//                         ))}
//                     </div>

//                     <hr class="row" />

//                     <div class="history">
//                         <h4>历史搜索</h4>
//                         <hr class="row" />

//                         <div style={{ display: data.historyKeywords.length > 0 ? 'block' : 'none' }}>
//                             ProductId         <div class="button">
//                                 <button on-click={methods.clearHistoryKeywords} class="btn btn-default btn-block">清除历史搜索记录</button>
//                             </div>
//                         </div>


//                         <div style={{ display: data.historyKeywords.length == 0 ? 'block' : 'none' }} class="norecords">
//                             <div class="user-favors norecords">
//                                 <div class="icon">
//                                     <i class="icon-search"></i>
//                                 </div>
//                                 <div class="text">你还没有历史搜索记录哦~~</div>
//                             </div>
//                         </div>

//                     </div>
//                 </section>
//             );

//         }
//     })

//     createHeader(page);

//     function createHeader(page: Page) {
//         let vm = new Vue({
//             el: page.header,
//             updated() {
//                 let input = vm.$el.querySelector('input');
//             },
//             render: function (h) {
//                 return (
//                     <header>
//                         <nav style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
//                             <button on-click={() => window['app'].back()} class="leftButton">
//                                 <i class="icon-chevron-left"></i>
//                             </button>
//                             <form action="" class="input-group" style="display: table; padding: 8px 10px 0 0;">
//                                 <input type="search" class="form-control" />
//                                 <span class="input-group-btn"><button type="button" class="btn btn-default">搜索</button></span>
//                             </form>
//                         </nav>
//                     </header>
//                 );
//             }
//         });

//         //======================================================
//         // 注：在 ios safari 下无效
//         vm.$nextTick(() => (page.header.querySelector('input') as HTMLInputElement).focus());
//         //======================================================
//     }
// }
