import { Page, Menu, defaultNavBar, app } from 'site';
import { ShoppingCartService, ShopService, ShoppingCartItem, userData } from 'services';

let { imageDelayLoad, ImageBox, PullDownIndicator, PullUpIndicator, HtmlView, Panel,
    PageComponent, PageHeader, PageFooter, PageView, Button, Dialog } = controls;


export default function (page: Page, hideMenu: boolean = false) {

    interface ShoppingCartState {
        items?: ShoppingCartItem[], status?: 'normal' | 'edit',
        totalAmount?: number, selectedCount?: number,
        deleteItems: Array<ShoppingCartItem>
    }

    let shoppingCart = page.createService(ShoppingCartService);
    let shop = page.createService(ShopService);

    class ShoppingCartPage extends React.Component<
        { hideMenu: boolean, pageName: string },
        ShoppingCartState>{

        private dialog: controls.Dialog;

        constructor(props) {
            super(props);
            this.setStateByItems(userData.shoppingCartItems.value || []);
            userData.shoppingCartItems.add(items => {
                this.setStateByItems(items);
            })
        }

        private selectItem(item: ShoppingCartItem) {
            if (this.state.status == 'edit') {
                let itemIndex = this.state.deleteItems.indexOf(item);
                if (itemIndex >= 0)
                    this.state.deleteItems = this.state.deleteItems.filter((o, i) => i != itemIndex);
                else
                    this.state.deleteItems.push(item);

                this.setState(this.state);
                return;
            }
            let p = shoppingCart.updateItem(item.ProductId, item.Count, !item.Selected);
            showDialog(this.dialog, p);
            return p;
        }
        private deleteSelectedItems() {
            let items: ShoppingCartItem[] = this.state.deleteItems;
            return shoppingCart.removeItems(items.map(o => o.ProductId)).then(items => {
                this.setStateByItems(items);
                this.state.deleteItems = [];
                this.setState(this.state);
            });
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
            if (this.state.status == 'normal')
                this.state.status = 'edit';
            else
                this.state.status = 'normal';

            this.setState(this.state);
        }
        private checkAll() {
            if (this.state.status == 'normal') {
                let p: Promise<any>;
                if (this.isCheckedAll()) {
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

            if (this.isCheckedAll()) {
                this.state.deleteItems = [];
            }
            else {
                this.state.deleteItems = this.state.items;
            }
            this.setState(this.state);

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

            let state = this.state || { status: 'normal', deleteItems: [] } as ShoppingCartState;

            let selectItems = items.filter(o => o.Selected);

            state.selectedCount = 0;
            selectItems.filter(o => !o.IsGiven).forEach(o => state.selectedCount = state.selectedCount + o.Count);
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
        private isChecked(item: ShoppingCartItem) {
            if (this.state.status == 'normal') {
                return item.Selected;
            }
            return this.state.deleteItems.indexOf(item) >= 0;
        }
        private isCheckedAll() {
            if (this.state.status == 'normal') {
                let selectedItems = this.state.items.filter(o => o.Selected);
                return selectedItems.length == this.state.items.length;
            }

            return this.state.deleteItems.length == this.state.items.length;
        }
        private deleteConfirmText(items: ShoppingCartItem[]) {
            let str = "是否要删除？<br/> " + items.map(o => '<br/>' + o.Name);
            return str;
        }

        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({
                            title: '购物车',
                            showBackButton: this.props.hideMenu,
                            right: this.state.items.length > 0 ?
                                <button onClick={this.onEditClick.bind(this)} className="right-button" style={{ width: 'unset' }}>
                                    {(this.state.status == 'edit') ? '完成' : '编辑'}
                                </button> : null
                        })}
                    </PageHeader>
                    <PageFooter>
                        {this.state.items.length > 0 ?
                            <div className="settlement container" style={{ bottom: this.props.hideMenu ? 0 : null, paddingLeft: 0 }}>
                                <div className="pull-left" style={{ paddingTop: 2 }}>
                                    <Button className="select-all" onClick={() => this.checkAll()}>
                                        {this.isCheckedAll() ?
                                            <i className="icon-ok-sign"></i>
                                            :
                                            <i className="icon-circle-blank"></i>
                                        }
                                        <span className="text">全选</span>
                                    </Button>
                                </div>
                                {this.state.status == 'normal' ?
                                    <div className="pull-right" style={{ textAlign: 'right', paddingRight: 0 }}>
                                        <label style={{ paddingRight: 10 }}>
                                            总计：<span className="price">￥{this.state.totalAmount.toFixed(2)}</span>
                                        </label>
                                        <Button className="btn btn-primary" onClick={() => this.buy()} disabled={this.state.selectedCount == 0}>
                                            结算{this.state.selectedCount > 0 ? (<span>（{this.state.selectedCount}）</span>) : null}
                                        </Button>
                                    </div>
                                    :
                                    <div className="pull-right">
                                        <Button className="btn btn-primary" onClick={() => this.deleteSelectedItems()} disabled={this.state.deleteItems.length == 0}
                                            confirm={this.deleteConfirmText(this.state.deleteItems)}>
                                            删除
                                        </Button>
                                    </div>}

                            </div> : null
                        }
                        {(!this.props.hideMenu ? <Menu pageName={this.props.pageName} /> : null)}
                    </PageFooter>
                    <PageView className="main container">
                        {this.state.items.length > 0 ?
                            <ul className="list-group">
                                {this.state.items.map(o =>
                                    <li key={o.Id} className="list-group-item row">
                                        {!o.IsGiven ?
                                            <Button onClick={() => this.selectItem(o)} className="pull-left icon">
                                                <i className={this.isChecked(o) ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
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
                                                    {this.state.status == 'normal' || o.IsGiven ?
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

    ReactDOM.render(<ShoppingCartPage hideMenu={hideMenu} pageName={page.name} />, page.element);
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