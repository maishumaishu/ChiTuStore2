import { Page, defaultNavBar, app, formatDate } from 'site';
import { ShoppingService, AccountService, Order } from 'services';

let { PageComponent, PageHeader, PageFooter, PageView, Dialog, Button } = controls;

export default function (page: Page) {

    let shopping = page.createService(ShoppingService);

    class PurchasePage extends React.Component<{ order: Order }, {}> {
        private purchase() {
            return Promise.resolve();
        }
        render() {
            let order = this.props.order;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '订单概况' })}
                    </PageHeader>
                    <PageFooter>
                        {order.Status == 'WaitingForPayment' ?
                            <div className="container">
                                <Button onClick={() => this.purchase()} className="btn btn-block btn-primary">微信支付</Button>
                            </div> : null}
                    </PageFooter>
                    <PageView>
                        <div className="container">
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>订单状态</label>
                                <div className="col-xs-9" style={{ color: '#f70' }}>
                                    {shopping.orderStatusText(order.Status)}
                                </div>
                            </div>
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>订单编号</label>
                                <div className="col-xs-9">{order.Serial}</div>
                            </div>
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>订单总计</label>
                                <div className="col-xs-9 price">￥{order.Sum}</div>
                            </div>
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>收货信息</label>
                                <div className="col-xs-9">{order.ReceiptAddress}</div>
                            </div>
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>发票信息</label>
                                <div className="col-xs-9">{order.Invoice}</div>
                            </div>
                            <div className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>下单时间</label>
                                <div className="col-xs-9" data-bind="text:['{0:g}', order.OrderDate]">
                                    {formatDate(order.OrderDate)}
                                </div>
                            </div>
                            {order.Remark ?
                                <div data-bind="visible:ko.unwrap(order.Remark)" className="row" style={{ paddingBottom: 10 }}>
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>订单备注</label>
                                    <div className="col-xs-9">
                                        {order.Remark}
                                    </div>
                                </div> : null}
                            <div style={{ marginBottom: 10 }}>
                                提示：请在下单24小时内付款，过期后订单将自动取消。
                            </div>

                        </div>
                    </PageView>
                </PageComponent >
            );
        }
    }

    shopping.order(page.routeData.values.id).then(order => {
        ReactDOM.render(<PurchasePage order={order} />, page.element);
    })
}