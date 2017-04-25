import { Page } from 'site';
import { defaultNavBar } from 'site';
import { CouponCode, ShoppingService } from 'services';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList, Tabs } = controls;

export default function (page: Page) {
    let shopping = page.createService(ShoppingService);

    let defaultIndex = 0;
    type Status = 'available' | 'used' | 'expired';
    let statuses: Status[] = ['available', 'used', 'expired'];
    class CouponPage extends React.Component<{}, { status: Status }>{
        private dataView: controls.PageView;
        private dataList: controls.DataList;

        constructor(props) {
            super(props);
            this.state = { status: statuses[defaultIndex] }
        }

        activeItem(index: number) {
            this.state.status = statuses[index];
            this.setState(this.state);
        }
        loadData(pageIndex: number, status: string) {
            return shopping.myCoupons(pageIndex, status);
        }
        componentDidUpdate() {
            this.dataList.reset();
            this.dataList.loadData();
        }
        render() {
            let status = this.state.status;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的优惠券' })}
                        <Tabs className="tabs" defaultActiveIndex={defaultIndex} onItemClick={(index) => this.activeItem(index)}
                            scroller={() => this.dataView.element} >
                            {statuses.map(o => (
                                <span key={o}>{shopping.couponStatusText(o)}</span>
                            ))}
                        </Tabs>
                    </PageHeader>
                    <PageView ref={o => this.dataView = o}>
                        <hr />
                        <DataList ref={o => this.dataList = o}
                            loadData={(pageIndex) => this.loadData(pageIndex, status)}
                            dataItem={(o: CouponCode) => (
                                <div key={o.Id}>
                                    <div className="coupon">
                                        <div className={`pull-left ${status}`}>
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
                            emptyItem={
                                <div className="norecords">
                                    <div className="icon">
                                        <i className="icon-money">

                                        </i>
                                    </div>
                                    <h4 className="text">暂无{shopping.couponStatusText(status)}的优惠券</h4>
                                </div>
                            } />
                    </PageView>
                </PageComponent>
            )
        }
    }

    ReactDOM.render(<CouponPage />, page.element);
}
/*

 <div className="pull-left" style={{ position: 'relative', top: 4, left: 16, width: '100%', paddingLeft: 50 }}>
                                            <div>{o.Title}</div>
                                            <div style={{ paddingTop: 6 }}>
                                                <span style={{ paddingRight: 8 }}>有效期 </span>
                                                <span>{o.ValidBegin}</span> 至
                                            <span>{o.ValidEnd}</span>
                                            </div>
                                            <div data-bind="html:Remark" style={{ paddingTop: 6 }}>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', position: 'absolute' }}>
                                            <div data-bind="text:Discount + \'元\'" style={{ fontSize: 24 }}>
                                                ￥{o.Discount.toFixed(2)}元
                                        </div>
                                            <div style={{ paddingLeft: 4 }}>
                                                {shopping.couponStatusText(status)}
                                            </div>
                                            <div data-bind="visible:Selected" style={{ position: 'relative', top: 6 }}>
                                                <i className="icon-ok-sign text-primary" style={{ fontSize: 26 }}></i>
                                            </div>
                                        </div>
                                        <div className="clearfix"></div>*/