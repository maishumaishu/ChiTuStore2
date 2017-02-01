import { Page, defaultNavBar, app } from 'site';
import { ShopService, ReceiptInfo } from 'services';

let { PageComponent, PageHeader, PageView, Button } = controls;

export default function (page: Page) {

    let shop = page.createService(ShopService);
    let setAddress: (address: string, receiptId: string) => void = page.routeData.values.callback;

    class ReceiptListPage extends React.Component<{ items: ReceiptInfo[] }, { items?: ReceiptInfo[] }>{
        constructor(props) {
            super(props);
            this.setStateByItems(this.props.items);
        }
        private setStateByItems(items: ReceiptInfo[]) {
            let state = {} as { items: ReceiptInfo[] };

            state.items = items;
            if (this.state == null)
                this.state = state;
            else
                this.setState(state);
        }
        private detail(item: ReceiptInfo) {
            var result = `${item.ProvinceName} ${item.CityName} ${item.CountyName} ${item.Address}`;

            result = result + ` 联系人: ${item.Consignee}`;
            if (item.Phone != null || item.Mobile != null)
                result = result + ` 电话：${item.Phone || ''} ${item.Mobile || ''}`;

            return result;
        }
        private newReceipt() {

        }
        private deleteReceipt() {
            return Promise.resolve();
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: setAddress ? '选择收货地址' : '收货地址' })}
                    </PageHeader>
                    <PageView>
                        <div data-bind="foreach: receipts">
                            {this.state.items.map(o => (
                                <div key={o.Id} style={{ marginBottom: 14 }}>
                                    <div className="container">
                                        <h5 data-bind="text:Name">{o.Name}</h5>
                                        <div onClick={() => { setAddress(this.detail(o), o.Id); app.back() } } className="small">{this.detail(o)}</div>
                                    </div>
                                    <div style={{ marginTop: 6 }}>
                                        <hr style={{ marginBottom: 8 }} />
                                        <div className="container">
                                            <div className="pull-left">
                                                <a data-bind="tap:$parent.setDefaultReceipt,click:$parent.setDefaultReceipt" href="javascript:">
                                                    {(o.IsDefault ? <i className="icon-ok-sign" style={{ fontSize: 20 }}></i> : <i className="icon-circle-blank" style={{ fontSize: 20 }}></i>)}
                                                    <span style={{ marginLeft: 8 }}>默认地址</span>
                                                </a>
                                            </div>
                                            <div className="pull-right">
                                                <a href={`#user_receiptEdit?id=${o.Id}`}>
                                                    <span className="icon-pencil" style={{ fontSize: 20 }}></span>
                                                    <span style={{ marginLeft: 4 }}>编辑</span>
                                                </a>
                                                <Button onClick={() => this.deleteReceipt()} confirm={"你删除该收货地址吗？"}
                                                    style={{ marginLeft: 12, border: 'none', background: 'none' }}>
                                                    <span className="icon-remove" style={{ fontSize: 20 }}></span>
                                                    <span style={{ marginLeft: 4 }}>删除</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="clearfix"></div>
                                        <hr style={{ marginTop: 8, borderTopWidth: 12 }} />
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="container">
                            <div style={{ marginBottom: 20 }}>
                                <button onClick={() => this.newReceipt()} className="btn btn-primary btn-block">
                                    添加新的收货地址
                                </button>
                            </div>
                        </div>
                    </PageView>
                </PageComponent>
            );
        }
    }

    shop.receiptInfos().then(items => {
        ReactDOM.render(<ReceiptListPage items={items} />, page.element);
    })

}