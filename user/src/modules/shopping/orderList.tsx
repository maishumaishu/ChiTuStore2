import { Page, defaultNavBar } from 'site';
import { ShopService, Order } from 'services';

let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs } = controls;
type DataList = controls.DataList;

export default function (page: Page) {

    let orderListView: OrderListView;
    //let orderListHeader: OrderListHeader;
    let shop = page.createService(ShopService);

    // page.loadingView.style.display = 'none';

    class OrderListView extends React.Component<{}, { activeIndex: number }>{

        private dataView: controls.PageView;
        private dataList: DataList;
        // private tabs: HTMLElement;

        constructor(props) {
            super(props);
            this.state = { activeIndex: 0 };
        }

        private loadData = (pageIndex: number) => {
            let type: "WaitingForPayment" | "Send";
            if (this.state.activeIndex == 1)
                type = "WaitingForPayment";
            else if (this.state.activeIndex == 2)
                type = 'Send';

            return shop.myOrderList(pageIndex, type);
        }

        private activeItem(index) {
            this.state.activeIndex = index;
            this.setState(this.state);

            orderListView.state.activeIndex = index;
            orderListView.setState(orderListView.state);
        }


        // componentDidMount() {
        //     let scrollTop: number;
        //     this.dataView.addEventListener('scroll', () => {
        //         if (this.dataView.scrollTop - scrollTop > 0) { //向上 >0 //page.dataView.scrollTop > 100
        //             if (this.dataView.scrollTop > 100)
        //                 this.tabs.style.top = '0px';
        //         }
        //         else {
        //             this.tabs.style.removeProperty('top');
        //         }
        //         scrollTop = this.dataView.scrollTop;
        //     })
        // }


        componentDidUpdate() {
            //let dataList = this.refs['dataList'] as DataList;
            this.dataList.reset();
            this.dataList.loadData();
        }



        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的订单' })}
                        <Tabs className="tabs" onItemClick={(index) => this.activeItem(index)}
                            scroller={() => this.dataView.element} >
                            <span>全部</span>
                            <span>待付款</span>
                            <span>待收货</span>
                        </Tabs>
                    </PageHeader>
                    <PageView ref={o => this.dataView = o}>
                        <DataList ref={o => this.dataList = o} loadData={(pageIndex) => this.loadData(pageIndex)} dataItem={(o: Order) => (
                            <div key={o.Id} className="order-item">
                                <hr />
                                <div className="header">
                                    <a href={`#shopping_orderDetail?id=${o.Id}`}>
                                        <h4>订单编号：{o.Serial}</h4>
                                        <div className="pull-right">
                                            <i className="icon-chevron-right"></i>
                                        </div>
                                    </a>
                                </div>
                                <div className="body">
                                    <ul>
                                        {o.OrderDetails.map((c, i) => (
                                            <li key={i}>
                                                <ImageBox src={c.ImageUrl} className="img-responsive img-thumbnail img-full" />
                                            </li>
                                        ))}
                                    </ul>
                                    {o.OrderDetails.length == 1 ?
                                        <div className="pull-right" style={{ width: '75%', fontSize: '16px', paddingLeft: '16px', paddingTop: '4px' }}>
                                            {o.OrderDetails[0].ProductName}
                                        </div>
                                        : null}
                                    <div className="clearfix"></div>
                                </div>
                                <div className="footer">
                                    <h4 className="pull-left">
                                        实付款：<span className="price">￥{o.Amount.toFixed(2)}</span>
                                    </h4>
                                    <div className="pull-right">
                                        <button className="btn btn-small btn-primary pull-right">立即付款</button>
                                    </div>
                                </div>
                            </div>
                        )} />
                    </PageView>
                </PageComponent>
            );
        }
    }

    class OrderListHeader extends React.Component<{}, { activeIndex: number }>{
        constructor(props) {
            super(props);
            this.state = { activeIndex: 0 };
        }

        private activeItem(index: number) {
            this.state.activeIndex = index;
            this.setState(this.state);

            orderListView.state.activeIndex = index;
            orderListView.setState(orderListView.state);
        }

        private get tabs() {
            return this.refs['tabs'] as HTMLElement;
        }

        render() {
            return (
                <div>
                    {defaultNavBar({ title: '我的订单' })}
                    <ul ref="tabs" className="tabs" style={{ transition: '0.4s' }}>
                        <li onClick={() => this.activeItem(0)}
                            className={this.state.activeIndex == 0 ? 'active' : ''}>
                            全部
                        </li>
                        <li onClick={() => this.activeItem(1)}
                            className={this.state.activeIndex == 1 ? 'active' : ''}>
                            待付款
                        </li>
                        <li onClick={() => this.activeItem(2)}
                            className={this.state.activeIndex == 2 ? 'active' : ''}>
                            待收货
                        </li>
                    </ul>
                </div>
            );
        }
    }

    orderListView = ReactDOM.render(<OrderListView ></OrderListView>, page.element)


}
