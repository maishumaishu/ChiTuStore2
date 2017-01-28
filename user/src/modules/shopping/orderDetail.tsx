import { app, Page, defaultNavBar } from 'site';
import { Order, ShopService } from 'services';
import { ImageBox } from 'controls/imageBox';

export default function (page: Page) {
    let id = page.routeData.values.id;

    class OrderDetailView extends React.Component<{ order: Order }, {}>{
        private purchase() {

        }
        private confirmReceived() {

        }
        private cancelOrder() {

        }
        render() {
            let o = this.props.order;
            return (
                <div>
                    <div className="container order" style={{ paddingTop: '10px' }}>
                        <div className="list">
                            <div>
                                <label>订单状态：</label>
                                <span style={{ color: '#f70' }}>{o.StatusText}</span>
                            </div>
                            <div>
                                <label>订单编号：</label>
                                <span>{o.Serial}</span>
                            </div>
                            <div>
                                <label className="pull-left">
                                    订单总计：
                                    </label>
                                <div>
                                    <span className="price">￥{o.Sum.toFixed(2)}</span>
                                    <span>（邮费：￥{o.Freight.toFixed(2)}）</span>
                                    {o.Status == 'WaitingForPayment' && o.BalanceAmount > 0 ?
                                        (<div>
                                            <strong>已付：</strong><span>￥{o.BalanceAmount.toFixed(2)}</span>
                                            <strong>待付：</strong><span>￥{(o.Sum - o.BalanceAmount).toFixed(2)}</span>
                                        </div>) :
                                        (null)}
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div>
                                <label>下单时间：</label>
                                <span>{o.OrderDate.toISOString()}</span>
                            </div>
                            <div>
                                <label style={{ float: 'left' }}>收货信息：</label>
                                <span style={{ float: 'left' }}>{o.ReceiptAddress}</span>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                        {o.Status == 'WaitingForPayment' ?
                            <button onClick={() => this.purchase()} className="btn btn-block btn-primary" style={{ marginTop: 10, marginBottom: 10 }}>微信支付</button>
                            : o.Status == 'Send' ?
                                <button onClick={() => this.confirmReceived()} data-dialog="confirm:'你确定收到货了吗？'" className="btn btn-primary btn-block" style={{ marginTop: 10, marginBottom: 10 }}>确认收货</button>
                                : (null)
                        }
                    </div>
                    <div data-bind="with:order" className="container order">
                        <div>
                            <h4 className="text-primary" style={{ fontWeight: 'bold' }}>购物清单</h4>
                        </div>
                        <div name="orderDetails" className="list">
                            {o.OrderDetails.map(d => (
                                <div onClick={() => app.redirect(`#home_product?id=${d.ProductId}`)} key={d.ProductId} className="row">
                                    <div className="col-xs-4" style={{ paddingRight: 0 }}>
                                        <ImageBox src={d.ImageUrl} className="img-responsive" />
                                    </div>
                                    <div className="col-xs-8">
                                        <div className="title">{d.ProductName}</div>
                                        <div>价格：<span className="price">￥{d.Price.toFixed(2)}</span></div>
                                        <div>数量：<span>{d.Quantity}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div data-bind="with:order" className="container" style={{ paddingTop: 10, paddingBottom: 20 }}>
                        {o.Status == 'WaitingForPayment' ?
                            (<button onClick={() => this.cancelOrder()}
                                data-dialog='confirm:"你取消该定单吗？"' href="javascript:"
                                className="btn btn-block btn-default">取消订单</button>)
                            : (null)}

                    </div>

                </div>
            );
        }
    }

    let shop = page.createService(ShopService);
    shop.order(id).then(order => {
        page.loadingView.style.display = 'none';
        ReactDOM.render(<OrderDetailView order={order} />, page.dataView);
    })
    ReactDOM.render(defaultNavBar({ title: '订单详情' }), page.header);
}