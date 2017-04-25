import { Page, defaultNavBar } from 'site';
import { ShoppingService, Coupon } from 'services'
import * as ui from 'ui';

let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs } = controls;

export default function (page: Page) {
    let shopping = page.createService(ShoppingService);
    class StoreCouponsPage extends React.Component<{ coupons: Coupon[] }, {}>{
        receiveCoupon(coupon: Coupon): Promise<any> {
            return shopping.receiveCoupon(coupon.Id);
        }
        render() {
            let coupons = this.props.coupons;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '店铺优惠劵' })}
                    </PageHeader>
                    <PageView>
                        {coupons.length > 0 ?
                            <hr />
                            :
                            <div className="norecords">
                                <div className="icon">
                                    <i className="icon-money">

                                    </i>
                                </div>
                                <h4 className="text">暂无可领取的优惠券</h4>
                            </div>
                        }
                        {coupons.map(o =>
                            <div key={o.Id}>
                                <div className="coupon">
                                    <button className={`pull-right receive available`}
                                        ref={(btn: HTMLButtonElement) => {
                                            if (!btn) return;
                                            btn.onclick = ui.buttonOnClick(() => {
                                                return this.receiveCoupon(o);
                                            }, { toast: '领取优惠劵成功' });
                                        }}>
                                        立即领取
                                    </button>
                                    <div className="main">
                                        <div>
                                            ￥{o.Discount}
                                        </div>
                                        <div className="date">
                                            {`有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`}
                                            <div>
                                                {o.Amount ? <span>满{o.Amount}元可以使用</span> : <span>任意金额可用使用</span>}
                                            </div>
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

    shopping.storeCoupons().then(coupons => {
        // coupons = [];
        ReactDOM.render(<StoreCouponsPage coupons={coupons} />, page.element);
    });

}