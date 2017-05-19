import { Page, defaultNavBar } from 'site';
import { ShoppingService, Product } from 'services';

let { loadImage, ImageBox, PullDownIndicator, PullUpIndicator, DataList, Panel,
    PageComponent, PageHeader, PageFooter, PageView, Tabs } = controls;

export default function (page: Page) {

    let shop = page.createService(ShoppingService);
    let categoryId = page.routeData.values.categoryId;

    class ProductListView extends React.Component<{ title: string }, {}>{

        private dataView: HTMLElement;

        loadProducts(pageIndex: number) {
            return shop.products(categoryId, pageIndex).then(items => {
                return items;
            });
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: this.props.title })}
                        <Tabs className="tabs" scroller={() => this.dataView}>
                            <span className="active">综合</span>
                            <span className="">销量</span>
                            <span>
                                <span>价格</span>
                                <span className="icon-angle-up"></span>
                            </span>
                        </Tabs>
                    </PageHeader>
                    <PageView ref={(o) => o ? this.dataView = o.element : null}>
                        <DataList className="products" scroller={() => this.dataView} loadData={this.loadProducts}
                            dataItem={(o: Product) => (
                                <a key={o.Id} href={`#home_product?id=${o.Id}`} className="col-xs-6 text-center item">
                                    <ImageBox src={o.ImageUrl} />
                                    <div className="bottom">
                                        <div className="interception">{o.Name}</div>
                                        <div>
                                            <div className="price pull-left">￥{o.Price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </a>
                            )} />
                    </PageView>
                </PageComponent>
            );
        }
    }

    class ProductListHeader extends React.Component<{ title: string }, {}>{
        render() {
            return (
                <div>
                    {defaultNavBar({ title: this.props.title })}
                    <ul className="tabs" style={{ margin: '0px' }}>
                        <li>
                            <a className="active">综合</a>
                        </li>
                        <li>
                            <a className="">销量</a>
                        </li>
                        <li>
                            <span>价格</span>
                            <span className="icon-angle-up"></span>
                        </li>
                    </ul>
                </div>
            );
        }
    }

    // ReactDOM.render(<ProductListView />, page.dataView);
    shop.category(categoryId).then(o => {
        ReactDOM.render(<ProductListView title={o.Name} />, page.element);
    })
}