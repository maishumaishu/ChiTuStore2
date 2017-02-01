import { Page, defaultNavBar } from 'site';
import { ShopService, FavorProduct } from 'services';
import { app } from 'site';

let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox } = controls;


export default function (page: Page) {
    let shop = page.createService(ShopService);

    class FavorPage extends React.Component<{}, {}>{
        private unfavor: Function;
        private dataView: HTMLElement;

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
            app.redirect(`#home_product?id=${productId}`);
        }
        loadFavorProducts(pageIndex: number) {
            if (pageIndex > 0) {
                return Promise.resolve([]);
            }
            return shop.favorProducts().then(items => {
                return items;
            });
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的收藏' })}
                    </PageHeader>
                    <PageView ref={o => o ? this.dataView = o.element : null}>
                        <DataList className="container" loadData={this.loadFavorProducts} dataItem={(o: FavorProduct) => (
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
                    </PageView>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<FavorPage />, page.element);
}