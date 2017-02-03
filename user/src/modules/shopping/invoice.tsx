import { Page, app, defaultNavBar } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs } = controls;

export default function (page: Page) {
    interface InvoicePageProps extends React.Props<InvoicePage> {
    }
    interface InvoicePageState {
        type: '个人' | '公司',
        title: string
    }

    let callback: (invoice: string) => void = page.routeData.values.callback;
    class InvoicePage extends React.Component<InvoicePageProps, InvoicePageState>{
        constructor(props) {
            super(props);
            this.state = { title: '', type: '个人' };
        }
        private confirm() {
            if (callback) {
                callback(`类型：${this.state.type}，抬头：${this.state.title}`);
            }
            app.back();
        }
        render() {
            let type = this.state.type;
            let title = this.state.title;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '发票信息' })}
                    </PageHeader>
                    <PageFooter>
                        <div className="container" style={{ paddingTop: 10, paddingBottom: 10 }}>
                            <button onClick={() => this.confirm()} className="btn btn-block btn-primary">确认</button>
                        </div>
                    </PageFooter>
                    <PageView>
                        <form className="container">
                            <div style={{ paddingTop: 20 }}>
                                <label className="choose">
                                    <input name="type" checked={type != '公司'} type="radio"
                                        onChange={() => {
                                            this.state.type = '个人';
                                            this.setState(this.state);
                                        } } /> 个人
                                </label>
                            </div>
                            <hr />
                            <div>
                                <label className="choose">
                                    <input name="type" checked={type == '公司'} type="radio"
                                        onChange={() => {
                                            this.state.type = '公司';
                                            this.setState(this.state);
                                        } } /> 公司
                                </label>
                            </div>
                            <hr />
                            <div className="form-group">
                                <label>发票抬头</label>
                                <input value={title} type="text" className="form-control" placeholder="个人或公司名称"
                                    onChange={(e) => {
                                        this.state.title = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    } } />
                            </div>
                        </form>
                    </PageView>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<InvoicePage />, page.element);
}