import { Page } from 'site';
import { ImageBox } from "controls/imageBox";
import { DataList } from "controls/dataList";

import { StationService, HomeProduct } from 'services';
import Carousel = require('core/carousel');
import { isAndroid } from 'site';

let { ScrollView } = controls;
//Hammer.defaults.touchAction = 'auto';

export default function (page: Page) {
    let station = page.createService(StationService);
    interface IndexPageState {
        advertItems: Array<{ ImgUrl: string, Id: string }>,
    }
    class IndexView extends React.Component<{}, IndexPageState> {
        private advertItems;

        scrollView: controls.ScrollView;

        constructor(props) {
            super(props);
            this.state = { advertItems: [] };
            station = new StationService();
            station.advertItems().then(items => {
                this.state.advertItems = items;
                this.setState(this.state);
                //===================================================
                //轮播停止
                let e = page.dataView.querySelector('[name="ad-swiper"]') as HTMLElement;
                console.assert(e != null);
                let c = new Carousel(e, { autoplay: true });
                let hammer = new Hammer.Manager(page.dataView);
                var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL });
                hammer.add(pan);
                hammer.on('panstart', function () {
                    c.stop();
                })

                hammer.on('panend', function () {
                    c.play();
                });
                //===================================================
            })
        }

        protected componentDidMount() {
        }

        private loadData(pageIndex): Promise<HomeProduct[]> {
            return station.proudcts(pageIndex);
        }

        render() {
            return (
                <ScrollView ref={(o) => this.scrollView = o}>
                    <div className="pulldown-indicator">
                        <span className="text">
                            上面什么也没有
                        </span>
                    </div>
                    <div style={{ minHeight: '80px' }} name="ad-swiper" className="carousel slide">
                        <ol className="carousel-indicators">
                            {this.state.advertItems.map(o =>
                                <li key={o.Id}></li>
                            )}
                        </ol>
                        <div className="carousel-inner">
                            {this.state.advertItems.map((o, i) =>
                                <div key={o.Id} className={i == 0 ? "item active" : "item"}>
                                    <ImageBox src={o.ImgUrl}>
                                    </ImageBox>
                                    <div className="carousel-caption">
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="quickbar">
                        <a className="col-xs-3 text-center" href="#user_favors">
                            <div style={{ position: 'relative', left: '50%' }}>
                                <div className="item">
                                    <i className="icon-heart"></i>
                                </div>
                            </div>
                            <div className="text">我的收藏</div>
                        </a>
                        <a className="col-xs-3 text-center" href="#shopping_orderList">
                            <div style={{ position: 'relative', left: '50%' }}>
                                <div className="item">
                                    <i className="icon-list"></i>
                                </div>
                            </div>
                            <div className="text">订单查询</div>
                        </a>
                        <a className="col-xs-3 text-center" href="#User_RechargeList">
                            <div style={{ position: 'relative', left: '50%' }}>
                                <div className="item">
                                    <i className="icon-credit-card"></i>
                                </div>
                            </div>
                            <div className="text">会员充值</div>
                        </a>
                        <a className="col-xs-3 text-center" href="#">
                            <div style={{ position: 'relative', left: '50%', width: '0px' }}>
                                <div className="item">
                                    <i className="icon-exchange"></i>
                                </div>
                            </div>
                            <div className="text">积分兑换</div>
                        </a>
                    </div>
                    <DataList className="row products" scroller={null} loadData={this.loadData}
                        dataItem={(o: HomeProduct) =>
                            <a key={o.Id} href={`#home_product?id=${o.ProductId}`} className="col-xs-6 text-center item">
                                <ImageBox src={o.ImagePath} />
                                <div className="bottom">
                                    <div className="interception">{o.Name}</div>
                                    <div>
                                        <div className="price pull-left">￥{o.Price.toFixed(2)}</div>
                                    </div>
                                </div>
                            </a>
                        }>
                    </DataList >
                </ScrollView>
            );
        }
    }

    class IndexHeader extends React.Component<{}, { visible: boolean, opacity: number }>{
        constructor(props) {
            super(props);
            this.state = { visible: true, opacity: 0 };
        }

        protected componentDidMount() {
            let header = page.header as HTMLElement;
            let scrollTop = 0;
            let dataViewElement = indexView.scrollView.element;
            dataViewElement.addEventListener('scroll', () => {
                scrollTop = dataViewElement.scrollTop;
                let p = scrollTop / 100;
                p = p > 1 ? 1 : p;
                let state = Object.assign(this.state, { opacity: p });
                this.setState(state);
            });
            //======================================
            var hammer = new Hammer.Manager(dataViewElement, { touchAction: 'auto' });
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_DOWN });
            hammer.add(pan);
            hammer.on('panstart', function (event) {
                if (scrollTop <= 0) {
                    header.style.display = 'none';
                }
            })

            hammer.on('panend', function () {
                if (header.style.display == 'none')
                    header.style.display = 'block';
            });
        }

        render() {
            return (
                <div style={{ display: this.state.visible ? 'block' : 'none' }}>
                    <nav className="bg-primary" style={{ opacity: this.state.opacity }}></nav>
                    <nav>
                        <a href="#user_messages" className="left-icon">
                            <i className="icon-map-marker">
                            </i>
                            <div>上海</div>
                        </a>
                        <a href="#user_messages" className="right-icon">
                            <i className="icon-comments-alt">
                            </i>
                            <div>消息</div>
                        </a>
                        <a href="#home_search" className="search-input form-control input-sm">
                            <span>寻找商品、品牌、品类</span>
                            <i className="icon-search"></i>
                        </a>
                    </nav>
                </div>
            );
        }
    }

    var indexView: IndexView = ReactDOM.render(<IndexView />, page.dataView);
    ReactDOM.render(<IndexHeader />, page.header);

    page.loadingView.style.display = 'none';

    if (isAndroid) {
        let start: number;
        // page.dataView.addEventListener('touchstart', function (event) {
        //     start = event.touches[0].clientY;
        // });
        // page.dataView.addEventListener('touchmove', function (event) {
        //     if (this.scrollTop <= 0 && (event.touches[0].clientY - start) > 0)
        //         event.preventDefault();
        // });
        //======================================
        // var hammer = new Hammer.Manager(page.dataView);
        // var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_DOWN });
        // page.dataView.style.transition = '0';
        // let scroller = page.dataView.children[0] as HTMLElement;
        // hammer.add(pan);
        // hammer.on('panmove', function (event) {
        //     if (scroller.scrollTop == 0) {
        //         scroller.style.transform = `translateY(${event.distance}px)`;
        //     }
        // });
        // hammer.on('panend', function () {
        //     scroller.style.removeProperty('transform');
        // })
    }

}