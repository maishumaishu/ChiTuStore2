import { Page, defaultNavBar } from 'site';
import { ShoppingService, CouponCode } from 'services'
import * as ui from 'ui';

let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs } = controls;

export default function (page: Page) {

    let orderId = page.routeData.values.orderId;
    if (!orderId) throw new Error('orderId cannt be empty.');

    let shopping = page.createService(ShoppingService);

    class OrderCouponsPage extends React.Component<{ couponCodes: CouponCode[] }, {}>{
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '请选择优惠劵' })}
                    </PageHeader>
                    <PageView>
                        <hr />
                        {this.props.couponCodes.map(o =>
                            <div key={o.Code}>
                                <div className="coupon">
                                    <div className={`pull-left available`}>
                                        ￥<span className="text">{o.Discount}</span>
                                    </div>
                                    <div className="main">
                                        <div>
                                            {o.Title}
                                        </div>
                                        <div className="date">
                                            {`有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`}
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )}
                    </PageView>
                </PageComponent>
            );
        }
    }
    shopping.orderAvailableCoupons(orderId).then(items => {
        ReactDOM.render(<OrderCouponsPage couponCodes={items} />, page.element);
    })
}