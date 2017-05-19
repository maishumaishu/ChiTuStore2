import { Page, defaultNavBar, app, formatDate } from 'site';
import { AccountService, BalanceDetail } from 'services';

let { PageComponent, PageHeader, PageView, Button, DataList } = controls;

export default function (page: Page) {

    let account = page.createService(AccountService);

    class RechargeListComponent extends React.Component<{}, {}> {
        constructor(props) {
            super(props);
        }

        private loadData(pageIndex: number): Promise<any[]> {
            return account.balanceDetails();
        }

        private typeText(item: BalanceDetail) {
            switch (item.Type) {
                case 'OrderPurchase':
                    return '购物消费';
                case 'OrderCancel':
                    return '订单退款';
                case 'OnlineRecharge':
                    return '线上充值';
                case 'StoreRecharge':
                    return '门店充值';
            }
            return item.Type;
        }

        private charge() {
            return Promise.resolve();
        }

        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({
                            title: '充值记录',
                            right: <Button onClick={() => this.charge()} className="right-button" style={{ width: 'unset' }}>充值</Button>
                        })}
                    </PageHeader>
                    <PageView>
                        <DataList loadData={(i) => this.loadData(i)} pageSize={10000}
                            dataItem={(o: BalanceDetail, i: number) =>
                                <div key={i} className="container">
                                    <div className="row" style={{ padding: '0px 10px 0px 10px' }}>
                                        <div className="pull-left">{formatDate(o.CreateDateTime)}</div>
                                        <div className="pull-right">
                                            结余：<span>¥{o.Balance.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="row" style={{ padding: '6px 10px 0px 10px' }}>
                                        <div className="pull-left">{this.typeText(o)}</div>
                                        <div className="pull-right">
                                            <span>{(o.Amount > 0 ? '+¥' : '-¥') + Math.abs(o.Amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <hr className="row" style={{ marginTop: 10, marginBottom: 10 }} />
                                </div>
                            }
                            emptyItem={
                                <div className="norecords">
                                    <div className="icon">
                                        <i className="icon-money">
                                        </i>
                                    </div>
                                    <h4 className="text">暂无充值记录</h4>
                                </div>} />
                    </PageView>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<RechargeListComponent />, page.element);
}