import { Page, defaultNavBar } from 'site';
import { ShopService, FavorProduct } from 'services';
import * as ui from 'core/ui';
import { DataList } from 'controls/dataList';
import { ImageBox } from 'controls/imageBox';

export default function (page: Page) {
    let shop = page.createService(ShopService);

    class FavorPage extends React.Component<{}, {}>{
        private unfavor: Function;
        constructor() {
            super();

            this.unfavor = (event: React.MouseEvent, item: FavorProduct) => {
                let btn = event.target as HTMLElement;

                return shop.unfavorProduct(item.ProductId).then(() => {
                    btn.style.opacity = '0';
                    setTimeout(() => {
                        btn.style.display = 'none';
                        (btn.nextSibling as HTMLElement).style.opacity = '1';
                    }, 400);
                });
            };
        }

        showProduct(productId: string) {
            debugger;
        }
        loadFavorProducts(pageIndex: number) {
            if (pageIndex > 0) {
                return Promise.resolve([]);
            }
            return shop.favorProducts().then(items => {
                page.loadingView.style.display = 'none';
                return items;
            });
        }
        render() {
            return (
                <DataList className="container" scroller={page.dataView} loadData={this.loadFavorProducts} dataItem={(o: FavorProduct) => (
                    <div key={o.ProductId}>
                        <div className="item row">
                            <div onClick={() => this.showProduct(o.ProductId)} className="col-xs-4">
                                <ImageBox src={o.ImageUrl} className="img-responsive" />
                            </div>
                            <div className="col-xs-8">
                                <div onClick={() => this.showProduct(o.ProductId)} className="name">
                                    <div>{o.ProductName}</div>
                                </div>
                                <button ref={`btn_${o.Id}`} onClick={(event) => this.unfavor(event, o)} className="pull-right">
                                    <i className="icon-heart"></i> 取消收藏
                                </button>
                                <label className="pull-right">
                                    已取消
                                </label>
                            </div>
                        </div>
                        <hr className="row" />
                    </div>
                )} />
            );
        }
    }

    ReactDOM.render(defaultNavBar({ title: '我的收藏' }), page.header);
    ReactDOM.render(<FavorPage />, page.dataView);
}