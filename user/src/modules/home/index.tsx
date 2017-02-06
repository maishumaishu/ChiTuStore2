import { Page, Menu, app } from 'site';
import { StationService, HomeProduct } from 'services';
//import { PageComponent, PageHeader, PageFooter, ScrollView, ImageBox, DataList } from 'controls';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

import Carousel = require('core/carousel');
import Hammer = require('hammer');

export default function (page: Page) {

    let station = page.createService(StationService);
    interface IndexPageState {
        advertItems: Array<{ ImgUrl: string, Id: string }>,
        headerVisible: boolean,
        headerOpacity: number
    }

    class IndexPage extends React.Component<{}, IndexPageState>{

        private dataView: controls.PageView;
        private header: controls.PageHeader;

        constructor(props) {
            super(props);
            this.state = { advertItems: [], headerVisible: true, headerOpacity: 0 };
            station.advertItems().then(items => {
                this.state.advertItems = items;
                this.setState(this.state);
                //===================================================
                //轮播停止
                let e = page.element.querySelector('[name="ad-swiper"]') as HTMLElement;
                console.assert(e != null);
                let c = new Carousel(e, { autoplay: true });
                let hammer = new Hammer.Manager(this.dataView.element);
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

        private loadData(pageIndex): Promise<HomeProduct[]> {
            return station.proudcts(pageIndex);
        }

        protected componentDidMount() {
            let header = this.header.element;
            let scrollTop = 0;
            let dataViewElement = this.dataView.element;
            dataViewElement.addEventListener('scroll', () => {
                scrollTop = dataViewElement.scrollTop;
                let p = scrollTop / 100;
                p = p > 1 ? 1 : p;
                this.state.headerOpacity = p;
                // let state = Object.assign(this.state, { opacity: p });
                this.setState(this.state);
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
                <PageComponent>
                    <PageHeader ref={o => this.header = o}>
                        {this.state.headerVisible ?
                            <div>
                                <nav className="bg-primary" style={{ opacity: this.state.headerOpacity }}></nav>
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
                            </div> : null
                        }
                    </PageHeader>
                    <PageView ref={(o) => this.dataView = o} className="main">
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
                            <a className="col-xs-3 text-center" href="#user_rechargeList">
                                <div style={{ position: 'relative', left: '50%' }}>
                                    <div className="item">
                                        <i className="icon-credit-card"></i>
                                    </div>
                                </div>
                                <div className="text">会员充值</div>
                            </a>
                            <a className="col-xs-3 text-center" href="#user_scoreList">
                                <div style={{ position: 'relative', left: '50%', width: '0px' }}>
                                    <div className="item">
                                        <i className="icon-exchange"></i>
                                    </div>
                                </div>
                                <div className="text">积分兑换</div>
                            </a>
                        </div>
                        <DataList className="products" loadData={this.loadData} showCompleteText={true}
                            dataItem={(o: HomeProduct) =>
                                <a key={o.Id} href={`#home_product?id=${o.ProductId}`} className="col-xs-6 text-center item">
                                    <ImageBox src={o.ImagePath} />
                                    <div className="bottom">
                                        <div className="interception">{o.Name}</div>
                                        <div>
                                            <div className="price pull-left">￥{o.Price.toFixed(2)}</div>
                                            <PromotionLabel text={o.PromotionLabel} className="pull-right" />
                                        </div>
                                    </div>
                                </a>
                            }>
                        </DataList >
                    </PageView>
                    <PageFooter>
                        <Menu pageName={page.name} />
                    </PageFooter>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<IndexPage />, page.element);
}


class PromotionLabel extends React.Component<{ text: string, className?: string }, {}>{
    private givenText: string;
    private reduceText: string;
    private discountText: string;
    private types: string[];

    constructor(props) {
        super(props);

        let pageName = app.currentPage.name;
        let shortName = (pageName == 'home.index' && (window.innerWidth <= 320)) ? true : false;
        if (shortName) {
            this.givenText = '赠';
            this.reduceText = '减';
            this.discountText = '折';
        }
        else {
            this.givenText = '满赠';
            this.reduceText = '满减';
            this.discountText = '满折';
        }

        this.types = this.props.text.split('|');
    }

    render() {
        let types = this.props.text.split('|');
        return (
            <span className={this.props.className}>
                <span style={{ display: this.types.indexOf('Given') >= 0 ? 'display' : 'none' }} className="label label-info" >
                    {this.givenText}
                </span>
                <span style={{ display: this.types.indexOf('Reduce') >= 0 ? 'display' : 'none' }} className="label label-success" >
                    {this.reduceText}
                </span>
                <span style={{ display: this.types.indexOf('Discount') >= 0 ? 'display' : 'none' }} className="label label-warning" >
                    {this.discountText}
                </span>
            </span>
        );
    }
}