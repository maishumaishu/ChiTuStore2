import { Page, defaultNavBar, app } from 'site';
import { ShoppingService, ShoppingCartService, AccountService, Order, userData } from 'services';
import { SetAddress, ReceiptListRouteValues } from 'modules/user/receiptList';

export default function (page: Page) {

    let { loadImage, ImageBox, PullDownIndicator, PullUpIndicator, HtmlView, Panel,
        PageComponent, PageHeader, PageFooter, PageView, Dialog } = controls;

    let shop = page.createService(ShoppingService);
    let shoppingCart = page.createService(ShoppingCartService)
    let account = page.createService(AccountService);

    interface OrderPageState {
        order: Order,
        // maxOrderBalance: number
    }

    class OrderPage extends React.Component<{ order: Order, balance: number }, OrderPageState>{
        private setAddress: SetAddress;
        constructor(props) {
            super(props);
            // this.setStateByOrder(this.props.order);
            this.state = { order: this.props.order };
            this.setAddress = (address: string, order: Order) => {
                Object.assign(this.state.order, order);
                this.setState(this.state);
            }
        }
        private showCoupons() {

        }
        private showInvoice() {

        }
        // private balancePay() {
        //     let order = this.state.order;
        //     // let balanceAmount = order.BalanceAmount > 0 ? 0 : this.state.maxOrderBalance;
        //     shop.balancePay(order.Id, balanceAmount).then(o => {
        //         order.BalanceAmount = o.BalanceAmount;
        //         this.setStateByOrder(order);
        //     });
        // }
        private confirmOrder() {

            let order = this.props.order;
            let orderId = order.Id;
            let remark = order.Remark;
            let invoice = order.Invoice;
            return shop.confirmOrder(orderId, remark, invoice).then(() => {
                let productIds = order.OrderDetails.map(o => o.ProductId);
                shoppingCart.removeItems(productIds);

                //===============================================
                // 进入后订单列表，按返回键可以进入到个人中心
                //app.setLocationHash('user_index');
                //================================================
                // let actualPaid = order.Sum - order.BalanceAmount;
                // if (actualPaid > 0) {
                app.redirect(`shopping_purchase?id=${order.Id}`);
                // }
                // else {
                //     app.redirect('shopping_orderList');
                // }
            });
        }
        private showReceiptList() {
            let routeValue: ReceiptListRouteValues = { callback: this.setAddress, orderId: this.state.order.Id };
            app.showPage('user_receiptList', routeValue);
        }
        render() {
            let order = this.state.order;
            // let balance = this.props.balance;

            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '确认订单', back: () => app.back() })}
                    </PageHeader>
                    <PageFooter>
                        <div className="container" style={{ paddingTop: 10, paddingBottom: 10 }}>
                            <button onClick={() => this.confirmOrder()} className="btn btn-block btn-primary">提交订单</button>
                        </div>
                    </PageFooter>
                    <PageView>
                        <div className="container">
                            <h4 className="text-primary">收货信息</h4>
                            <a style={{ minHeight: 40, display: order.ReceiptAddress ? 'none' : 'block' }}
                                         onClick={() => this.showReceiptList()}>
                                <div className="alert alert-danger text-center">
                                    点击这里设置收货信息
                                </div>
                            </a>
                            <a onClick={() => this.showReceiptList()}
                                className="address" style={{ minHeight: 40, display: order.ReceiptAddress ? 'block' : 'none' }}>
                                <div className="pull-left" style={{ paddingRight: 20 }}>
                                    <span className="small">{order.ReceiptAddress}</span>
                                </div>
                                <div className="pull-right">
                                    <i className="icon-chevron-right"></i>
                                </div>
                            </a>
                        </div>
                        <hr style={{ margin: 0, borderTopWidth: 10 }} />
                        <div className="container">
                            <h4 className="text-primary">购物清单</h4>
                        </div>
                        <div className="container">
                            <ul data-bind="foreach: order.OrderDetails" className="list-group row" style={{ marginBottom: 0 }}>
                                {order.OrderDetails.map((o, i) => (
                                    <li key={i} data-bind="visible:ko.unwrap(Price) >= 0" className="list-group-item">
                                        <div className="pull-left" style={{ width: 60, height: 60 }}>
                                            <ImageBox src={o.ImageUrl} className="img-responsive" />
                                        </div>
                                        <div style={{ marginLeft: 70 }}>
                                            <div style={{ marginBottom: 10 }}>
                                                <a href={`#home_product?id=${o.ProductId}`} className="title">
                                                    {o.ProductName}
                                                </a>
                                            </div>
                                            <div className="pull-left">
                                                <span className="price">￥{o.Price.toFixed(2)}</span>
                                                {(o.Score ? <span> + {o.Score} 积分</span> : null)}
                                            </div>
                                            <div className="pull-right">
                                                <span style={{ paddingLeft: 10 }}>X {o.Quantity}</span>
                                            </div>
                                        </div>
                                        <div className="clearfix"></div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                        <hr style={{ margin: 0, borderTopWidth: 10 }} />
                        <div className="container">
                            <h4 className="pull-left">配送方式</h4>
                            <div className="pull-right" style={{ paddingTop: 6 }}>
                                <span>快递 运费：<span className="price">￥{order.Freight.toFixed(2)}</span></span>
                            </div>
                        </div>
                        <hr style={{ margin: 0, borderTopWidth: 10 }} />

                        {order.CouponTitle ?
                            <div onClick={() => this.showCoupons()} className="container">
                                <h4 className="pull-left">优惠券</h4>
                                <div className="pull-right" style={{ paddingTop: 6 }}>
                                    <span style={{ paddingRight: 4 }}>
                                        {order.CouponTitle}
                                    </span>
                                    <i className="icon-chevron-right"></i>
                                </div>
                            </div> : null}

                        {order.CouponTitle ?
                            <hr data-bind="visible:order.CouponTitle" style={{ margin: 0, borderTopWidth: 10 }} />
                            : null}

                        <div className="container"
                            onClick={() => app.showPage('shopping_invoice', {
                                callback: (invoice: string) => {
                                    this.state.order.Invoice = invoice;
                                    this.setState(this.state);
                                }
                            })}>
                            <h4 className="pull-left">发票信息</h4>
                            <div className="pull-right" style={{ paddingTop: 6 }}>
                                <span style={{ paddingRight: 10 }}>{order.Invoice}</span>
                                <i className="icon-chevron-right"></i>
                            </div>
                        </div>
                        <hr style={{ margin: 0, borderTopWidth: 10 }} />
                        <div className="container" style={{ padding: 10 }}>
                            <input name="remark" type="text" multiple={true} style={{ width: '100%', height: 40, borderRadius: 4, border: '1px solid #dddddd' }}
                                placeholder=" 若你对订单有特殊性要求，可以在此备注" />
                        </div>

                        <div className="container">
                            <div className="row">
                                <div className="col-xs-4">商品</div>
                                <div className="col-xs-8 text-right">
                                    <span style={{ paddingRight: 4 }}>+</span>
                                    <span className="price">￥{order.Amount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-4">运费</div>
                                <div className="col-xs-8 text-right">
                                    <span style={{ paddingRight: 4 }}>+</span>
                                    <span className="price">￥{order.Freight.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-4">优惠</div>
                                <div className="col-xs-8 text-right">
                                    <span style={{ paddingRight: 6 }}>-</span>
                                    <span className="price">￥{(order.Discount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="col-xs-12" style={{ padding: 0, paddingTop: 8 }}>
                                {/*
                                {(balance > 0 ?
                                    <label className="pull-left" style={{ fontWeight: 'normal' }}>
                                        <input type="checkbox" checked={order.BalanceAmount > 0} onChange={() => this.balancePay()} />
                                        <span style={{ padding: '8px 4px 0px 8px' }}>余额支付</span>
                                        <span className="price">
                                            ￥{this.state.maxOrderBalance.toFixed(2)}
                                        </span>
                                    </label> : null)}*/}

                                <div className="pull-right">
                                    <span>总计：
                                    <span className="price">
                                            <strong>￥{order.Sum.toFixed(2)}</strong></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PageView >
                </PageComponent>
            );
        }
    }

    let id = page.routeData.values.id;
    Promise.all([shop.order(id)]).then(data => {
        let order = data[0];
        // let balance = data[1];
        ReactDOM.render(<OrderPage order={order} balance={userData.balance.value} />, page.element)
    })

}