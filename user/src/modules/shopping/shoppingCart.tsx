import { Page, Menu, defaultNavBar, app } from 'site';
import { ShoppingCartService, ShopService, ShoppingCartItem } from 'services';

let { imageDelayLoad, ImageBox, PullDownIndicator, PullUpIndicator, HtmlView, Panel,
    PageComponent, PageHeader, PageFooter, PageView, Button, Dialog } = controls;


export default function (page: Page, hideMenu: boolean = false) {

    interface ShoppingCartState {
        items?: ShoppingCartItem[], status?: 'read' | 'write',
        allChecked?: boolean, totalAmount?: number, selectedCount?: number,
    }

    let shoppingCart = page.createService(ShoppingCartService);
    let shop = page.createService(ShopService);

    class ShoppingCartPage extends React.Component<
        { items: ShoppingCartItem[], hideMenu: boolean, pageName: string },
        ShoppingCartState>{

        private dialog: controls.Dialog;

        constructor(props) {
            super(props);
            this.setStateByItems(this.props.items);
        }

        private selectItem(item: ShoppingCartItem) {

            let p = shoppingCart.updateItem(item.ProductId, item.Count, !item.Selected)
                .then((items) => {


                    this.setStateByItems(items);
                });

            showDialog(this.dialog, p);
            return p;
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
        private onEditClick() {
            if (this.state.status == 'read')
                this.state.status = 'write';
            else
                this.state.status = 'read';

            this.setState(this.state);
        }
        private checkAll() {
            let p: Promise<any>;
            if (this.state.allChecked) {
                p = shoppingCart.unselectAll();
            }
            else {
                p = shoppingCart.selectAll();
            }

            p.then((items) => {
                this.setStateByItems(items);
            })

            showDialog(this.dialog, p);
            return p;
        }
        private buy() {
            if (this.state.selectedCount <= 0)
                return;

            var items = this.state.items.filter(o => o.Selected);
            var productIds = items.map(o => o.ProductId);
            var quantities = items.map(o => o.Count);

            let result = shop.createOrder(productIds, quantities)
                .then((order) => {
                    app.redirect(`shopping_orderProducts?id=${order.Id}`)
                })

            return result;
        }
        private setStateByItems(items: ShoppingCartItem[]) {

            let state = this.state || { status: 'read' } as ShoppingCartState;

            let selectItems = items.filter(o => o.Selected);

            state.selectedCount = 0;
            selectItems.filter(o => !o.IsGiven).forEach(o => state.selectedCount = state.selectedCount + o.Count);
            state.allChecked = items.length == selectItems.length;
            state.items = items;

            state.totalAmount = 0;
            selectItems.forEach(o => {
                state.totalAmount = state.totalAmount + o.Amount;
            })

            if (this.state == null)
                this.state = state;
            else
                this.setState(state);
        }



        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({
                            title: '购物车',
                            showBackButton: this.props.hideMenu,
                            right: (
                                <button onClick={this.onEditClick.bind(this)} className="right-button" style={{ width: 'unset' }}>
                                    {(this.state.status == 'write') ? '完成' : '编辑'}
                                </button>
                            )
                        })}
                    </PageHeader>
                    <PageFooter>
                        <div className="settlement" style={{ bottom: this.props.hideMenu ? 0 : null }}>
                            <div data-bind="visible:shoppingCartItems().length > 0" className="container ">
                                <div className="pull-left" style={{ paddingTop: 2 }}>
                                    <Button className="select-all" onClick={() => this.checkAll()}>
                                        {this.state.allChecked ?
                                            <i className="icon-ok-sign"></i>
                                            :
                                            <i className="icon-circle-blank"></i>
                                        }
                                        <span className="text">全选</span>
                                    </Button>
                                </div>
                                <div className="pull-right" style={{ textAlign: 'right', paddingRight: 0 }}>
                                    <label style={{ paddingRight: 10 }}>
                                        总计：<span className="price">￥{this.state.totalAmount.toFixed(2)}</span>
                                    </label>
                                    <Button className="btn btn-primary" onClick={() => this.buy()} disabled={this.state.selectedCount == 0}>
                                        结算{this.state.selectedCount > 0 ? (<span>（{this.state.selectedCount}）</span>) : null}
                                    </Button>
                                </div>

                            </div>
                        </div>
                        {(!this.props.hideMenu ? <Menu pageName={this.props.pageName} /> : null)}
                    </PageFooter>
                    <PageView className="main container">
                        {this.state.items.length > 0 ?
                            <ul className="list-group">
                                {this.state.items.map(o =>
                                    <li key={o.Id} className="list-group-item row">
                                        {!o.IsGiven ?
                                            <Button onClick={() => this.selectItem(o)} className="pull-left icon">
                                                <i className={o.Selected ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
                                            </Button> : null}
                                        <a href={`#home_product?id=${o.ProductId}`} className="pull-left pic">
                                            {o.Type == 'Reduce' || o.Type == 'Discount' ?
                                                <div className={o.Type}>
                                                    {o.Type == 'Reduce' ? '减' : '折'}
                                                </div>
                                                :
                                                <ImageBox src={o.ImageUrl} className="img-responsive" />}
                                        </a>
                                        <div style={{ marginLeft: 110 }}>
                                            <a href={`#home_product?id=${o.ProductId}`} >{o.Name}</a>
                                            <div style={{ height: 42, paddingTop: 4 }}>
                                                <div className="price pull-left" style={{ marginTop: 10 }}>￥{o.Price.toFixed(2)}</div>
                                                <div className="pull-right" style={{ marginTop: 4 }}>
                                                    {this.state.status == 'read' || o.IsGiven ?
                                                        <div style={{ paddingLeft: 6 }}>X {o.Count}</div>
                                                        :
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
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                            :
                            <div className="norecords">
                                <div className="icon">
                                    <i className="icon-shopping-cart">

                                    </i>
                                </div>
                                <h4 className="text">你的购买车空空如也</h4>
                            </div>
                        }
                        <Dialog ref={(o) => this.dialog = o} />
                    </PageView>
                </PageComponent>
            )
        }
    }

    shoppingCart.items().then(items => {
        ReactDOM.render(<ShoppingCartPage items={items} hideMenu={hideMenu} pageName={page.name} />, page.element);
    });

}

function showDialog(dialog: controls.Dialog, p: Promise<any>) {
    dialog.content = '正在更新'
    dialog.show();
    p.then(() => {
        dialog.content = '更新成功'
        setTimeout(() => dialog.hide(), 1000);
    }).catch(() => {
        dialog.content = '更新失败'
        setTimeout(() => dialog.hide(), 1000);
    })
}