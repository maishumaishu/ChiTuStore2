import { Page, defaultNavBar } from 'site';
import { ShoppingCartService, ShoppingCartItem } from 'services';
import { ImageBox } from 'controls/imageBox';
import { ScrollView } from 'controls/scrollView';

export default function (page: Page) {

    let shoppingCart = page.createService(ShoppingCartService);

    class ShoppingCartView extends React.Component<{}, { items: ShoppingCartItem[] }>{
        constructor() {
            super();
            this.state = { items: [] };
            shoppingCart.items().then(items => {
                this.state.items = items;
                this.setState(this.state);
                page.loadingView.style.display = 'none';
            });
        }
        private selectItem(item: ShoppingCartItem) {
            item.Selected = !item.Selected;
            this.setState(this.state);
        }
        private decreaseCount(item: ShoppingCartItem) {
            item.Count = item.Count - 1;
            this.setState(this.state);
        }
        private increaseCount(item: ShoppingCartItem) {
            item.Count = item.Count + 1;
            this.setState(this.state);
        }
        private changeItemCount(item: ShoppingCartItem, value: string) {
            let count = Number.parseInt(value);
            if (!count) return;

            item.Count = count;
            this.setState(this.state);
        }
        render() {
            return <ScrollView className="container">
                <ul className="list-group">
                    {this.state.items.map(o =>
                        <li key={o.Id} className="list-group-item row">
                            <div className="pull-left icon">
                                <i onClick={() => this.selectItem(o)} className={o.Selected ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
                            </div>
                            <a href={`#home_product?id=${o.ProductId}`} className="pull-left pic">
                                <ImageBox src={o.ImageUrl} className="img-responsive" />
                            </a>
                            <div style={{ marginLeft: 110 }}>
                                <a href={`#home_product?id=${o.ProductId}`} >{o.Name}</a>
                                <div>
                                    <div className="price pull-left" style={{ marginTop: 10 }}>￥{o.Price.toFixed(2)}</div>
                                    <div className="pull-right">
                                        <div className="input-group" style={{ width: 120, display: o.IsGiven ? 'none' : 'table' }}>
                                            <span onClick={() => this.decreaseCount(o)} className="input-group-addon">
                                                <i className="icon-minus"></i>
                                            </span>
                                            <input value={`${o.Count}`} className="form-control" type="text" style={{ textAlign: 'center' }}
                                                onChange={(e) => (this.changeItemCount(o, (e.target as HTMLInputElement).value))} />
                                            <span onClick={() => this.increaseCount(o)} className="input-group-addon">
                                                <i className="icon-plus"></i>
                                            </span>
                                        </div>
                                        <div>
                                            <span data-bind="visible:IsGiven,text:'X ' + ko.unwrap(Count)" style={{ paddingLeft: 6, display: o.IsGiven ? 'block' : 'none' }}>X {o.Count}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </ScrollView>
        }
    }

    ReactDOM.render(defaultNavBar({ title: '购物车', showBackButton: false }), page.header);
    ReactDOM.render(<ShoppingCartView />, page.dataView);
}