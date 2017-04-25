import { Page, defaultNavBar } from 'site';
import { ShoppingService, Order } from 'services';
import { app } from 'site';

let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs, Button } = controls;
type DataList = controls.DataList;

export default function (page: Page) {

    let orderListView: OrderListView;
    let shop = page.createService(ShoppingService);

    let type = page.routeData.values.type;
    let defaultActiveIndex = 0;
    if (type == 'WaitingForPayment')
        defaultActiveIndex = 1;
    else if (type == 'Send')
        defaultActiveIndex = 2;

    class OrderListView extends React.Component<{}, { activeIndex: number }>{

        private dataView: controls.PageView;
        private dataList: DataList;

        constructor(props) {
            super(props);

            this.state = { activeIndex: defaultActiveIndex };
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

        componentDidUpdate() {
            this.dataList.reset();
            this.dataList.loadData();
        }

        private pay() {
            return Promise.resolve();
        }

        private confirmReceived() {
            return Promise.resolve();
        }

        /** 评价晒单 */
        private evaluate() {

        }

        private statusControl(order: Order) {
            let control: JSX.Element;
            let btnClassName = 'btn btn-small btn-primary pull-right';
            switch (order.Status) {
                case 'WaitingForPayment':
                    control = <a href={`#shopping_purchase?id=${order.Id}`} className={btnClassName}>立即付款</a>
                    break;
                case 'Send':
                    control = <Button className={btnClassName} onClick={() => this.confirmReceived()}
                        confirm={'你确定收到货了吗？'}>确认收货</Button>;
                    break;
                case 'ToEvaluate':
                    control = <a href={'#shopping_evaluation'} className={btnClassName}>评价晒单</a>;
                    break;
                case 'Canceled':
                    control = <label className="pull-right">已取消</label>;
                    break;
                case 'Paid':
                    control = <label className="pull-right">已付款</label>;
                    break;
                case 'Evaluated':
                    control = <label className="pull-right">已评价</label>;
                    break;
                case 'Received':
                    control = <label className="pull-right">已收货</label>;
                    break;
                default:
                    return null;
            }
            return control;
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的订单', back: () => app.redirect('user_index') })}
                        <Tabs className="tabs" defaultActiveIndex={defaultActiveIndex} onItemClick={(index) => this.activeItem(index)}
                            scroller={() => this.dataView.element} >
                            <span>全部</span>
                            <span>待付款</span>
                            <span>待收货</span>
                        </Tabs>
                    </PageHeader>
                    <PageView ref={o => this.dataView = o}>
                        <DataList ref={o => this.dataList = o} loadData={(pageIndex) => this.loadData(pageIndex)}
                            dataItem={(o: Order) => (
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
                                            {this.statusControl(o)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            emptyItem={
                                <div className="norecords">
                                    <div className="icon">
                                        <i className="icon-list">

                                        </i>
                                    </div>
                                    <h4 className="text">暂无此类订单</h4>
                                </div>
                            } />
                    </PageView>
                </PageComponent>
            );
        }
    }

    orderListView = ReactDOM.render(<OrderListView ></OrderListView>, page.element)


}
