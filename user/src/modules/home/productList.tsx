import { Page, defaultNavBar } from 'site';
import { ShopService, Product } from 'services';

import { DataList } from 'controls/dataList';
import { ImageBox } from 'controls/imageBox';

export default function (page: Page) {

    let shop = page.createService(ShopService);
    let categoryId = page.routeData.values.categoryId;

    class ProductListView extends React.Component<{}, {}>{
        loadProducts(pageIndex: number) {
            return shop.products(categoryId, pageIndex).then(items => {
                return items;
            });
        }
        render() {
            return (
                <DataList className="products" scroller={page.dataView} loadData={this.loadProducts}
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

    ReactDOM.render(<ProductListView />, page.dataView);
    shop.category(categoryId).then(o => {
        page.loadingView.style.display = 'none';
        ReactDOM.render(<ProductListHeader title={o.Name} />, page.header);
    })
}