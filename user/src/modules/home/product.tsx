import { ShoppingCartService, ShopService, Product, Promotion, CustomProperty, userData } from 'services';
import { Page, config, app } from 'site';
import { createStore } from 'redux';
import cm = require('chitu.mobile');
import BezierEasing = require('bezier-easing');


let { imageDelayLoad, ImageBox, PullDownIndicator, PullUpIndicator, HtmlView, Panel,
    PageComponent, PageHeader, PageFooter, PageView, Button } = controls;

let productStore = createStore((product: Product, args: { product: Product, type: string }) => {
    if (args) {
        product = args.product;
    }
    return product;
});



export default async function (page: Page) {

    interface ProductPageState {
        productSelectedText: string,
        pullUpStatus: 'init' | 'ready',
        isFavored: boolean,
        productsCount: number,
        content: string,
        count: number,
        product: Product;
    }

    let shop = page.createService(ShopService);
    let shoppingCart = page.createService(ShoppingCartService);
    let { id } = page.routeData.values


    let panelElement = document.createElement('div');
    page.element.appendChild(panelElement);


    class ProductPage extends React.Component<{ product: Product }, ProductPageState>{

        private dataView: HTMLElement;
        private header: controls.PageHeader;
        private introduceView: HTMLElement;
        private productPanel: ProductPanel;
        private productsCountSubscrbe: (value: number) => void;
        private isShowIntroduceView = false;
        private isShowProductView = false;

        constructor(props) {
            super(props);
            this.state = {
                productSelectedText: this.productSelectedText(this.props.product), content: null,
                pullUpStatus: 'init', isFavored: false, productsCount: userData.productsCount.value, count: 1,
                product: this.props.product
            };

            shop.isFavored(this.props.product.Id).then((isFavored) => {
                this.state.isFavored = isFavored;
                this.setState(this.state);
            });

            this.productsCountSubscrbe = (value) => {
                this.state.productsCount = value;
                this.setState(this.state);
            }
            userData.productsCount.add(this.productsCountSubscrbe);

            productStore.subscribe(() => {
                let p = productStore.getState();
                this.updateStateByProduct(p);
            })
        }

        private showPanel() {
            this.productPanel.show();
        }
        private productSelectedText(product: Product) {
            var str = '';
            var props = product.CustomProperties;
            for (var i = 0; i < props.length; i++) {
                var options = props[i].Options;
                for (var j = 0; j < options.length; j++) {
                    if (options[j].Selected) {
                        str = str + options[j].Name + ' ';
                        break;
                    }
                }
            }
            str = str + (this.state == null ? 1 : this.state.count) + '件';
            return str;
        }
        private showIntroduceView() {

            if (this.state.content == null) {
                shop.productIntroduce(this.state.product.Id).then((content) => {
                    this.state.content = content;
                    this.setState(this.state);
                });
            }

            this.dataView.style.transform = `translateY(-100%)`;
            this.dataView.style.transition = `0.4s`;
            setTimeout(() => {
                this.introduceView.style.transform = `translateY(0)`;
                this.introduceView.style.transition = `0.4s`;
            }, 500);
        }

        protected componentDidMount() {
            let buttons = this.header.element.querySelectorAll('nav button');
            let title = this.header.element.querySelector('nav.bg-primary') as HTMLElement;

            this.dataView.addEventListener('scroll', function (event) {
                let p = this.scrollTop / 100;
                p = p > 1 ? 1 : p;

                let buttonOpacity = 0.5 + p;
                buttonOpacity = buttonOpacity > 1 ? 1 : buttonOpacity;

                title.style.opacity = `${p}`;
                for (let i = 0; i < buttons.length; i++) {
                    (buttons[i] as HTMLElement).style.opacity = `${buttonOpacity}`;
                }

            });

        }

        protected componentWillUnmount() {
            userData.productsCount.remove(this.productsCountSubscrbe);
        }

        private favor() {
            let p: (productId: string) => Promise<any>
            if (this.state.isFavored) {
                p = shop.unfavorProduct;
            }
            else {
                p = shop.favorProduct;
            }

            return p.bind(shop)(this.props.product.Id).then(o => {
                this.state.isFavored = !this.state.isFavored;
                this.setState(this.state);
            })
        }

        private showProductView() {
            this.dataView.style.transform = `translateY(0)`;
            this.dataView.style.transition = `0.4s`;

            this.introduceView.style.transform = `translateY(100%)`;
            this.introduceView.style.transition = `0.4s`;
        }

        addToShoppingCart() {
            return shoppingCart.addItem(id, this.state.count);
        }

        updateProductCount(value) {
            this.state.count = value;
            this.state.productSelectedText = this.productSelectedText(this.props.product);
            this.state.content = null;
            this.setState(this.state);
        }

        updateStateByProduct(product: Product) {
            this.state.product = product;
            this.state.productSelectedText = this.productSelectedText(this.props.product);
            this.setState(this.state);
        }




        render() {
            let p = this.state.product;
            let productsCount = this.state.productsCount;
            return (
                <PageComponent>
                    <PageHeader style={{ position: 'fixed' }} ref={(o) => this.header = o}>
                        <nav className="bg-primary"></nav>
                        <nav>
                            <button onClick={() => app.back()} className="leftButton">
                                <i className="icon-chevron-left"></i>
                            </button>
                            <Button className="rightButton" onClick={() => this.favor()}>
                                <i className="icon-heart-empty" style={{ fontWeight: `800`, fontSize: `20px`, display: !this.state.isFavored ? 'block' : 'none' }} ></i>
                                <i className="icon-heart" style={{ display: this.state.isFavored ? 'block' : 'none' }}></i>
                            </Button>
                        </nav>
                    </PageHeader>
                    <PageView ref={(o) => this.dataView = o ? o.element : null} className="main"
                        panEnd={() => {
                            let prevent = false;
                            if (this.isShowIntroduceView) {
                                this.showIntroduceView();
                                this.isShowIntroduceView = false;
                                prevent = true;
                            }
                            return prevent;
                        }}>
                        <div name="productImages" className="swiper-container">
                            <div className="swiper-wrapper">
                                {p.ImageUrls.map(o => (
                                    <div key={o} className="swiper-slide" style={{ textAlign: "center" }}>
                                        <ImageBox src={o} className="img-responsive-100 img-full">
                                        </ImageBox>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="container">
                            <div name="productName" className="pull-left" style={{ width: '100%', marginLeft: '-20px' }}>
                                <h4 className="text-left" style={{ fontWeight: 'bold', paddingLeft: '20px' }}>{p.Name}</h4>
                            </div>

                            <div className="col-xs-12 box" style={{ padding: '10px 0px 10px 0px' }}>
                                <span>类别：</span>
                                <a href="">{p.ProductCategoryName}</a>
                            </div>

                            <div className="col-xs-12 box" style={{ padding: '10px 0px 10px 0px' }}>
                                <span className="pull-left">价格：<strong className="price">￥{p.Price.toFixed(2)}</strong></span>
                                <span className="pull-left" style={{ display: p.Score == null ? 'none' : 'block' }}>积分：<strong className="price">{this.props.product.Score}</strong></span>
                                <span className="pull-right">{p.Unit}</span>
                                <div className="clearfix"></div>
                                <p className="oldprice" style={{ display: p.MemberPrice != null && p.MemberPrice != p.Price ? 'block' : 'none' }}>
                                    促销价：<span className="price">￥{p.MemberPrice.toFixed(2)}</span>
                                </p>
                            </div>

                            <div onClick={() => this.showPanel()} className="col-xs-12 box" style={{ padding: '10px 0px 10px 0px' }}>
                                <div className="pull-left">
                                    <span>已选：</span>
                                    <span>{this.state.productSelectedText}</span>
                                </div>
                                <div className="pull-right">
                                    <i className="icon-chevron-right"></i>
                                </div>
                            </div>

                            {p.Promotions.length > 0 ?
                                <div className="col-xs-12 box" style={{ padding: '10px 0px 10px 0px' }}>
                                    {p.Promotions.map((o, i) => (
                                        <PromotionComponent key={i} promotion={o}></PromotionComponent>
                                    ))}
                                </div> : null
                            }
                        </div>
                        <hr />
                        <div className="container">
                            <h4 style={{ fontWeight: 'bold', width: '100%' }}>商品信息</h4>
                            {p.Arguments.map(o => (
                                <div key={o.key} style={{ marginBottom: '10px' }}>
                                    <div className="pull-left" style={{ width: '100px' }}>{o.key}</div>
                                    <div style={{ marginLeft: '100px' }}>{o.value}</div>
                                    <div className="clearfix"></div>
                                </div>
                            ))}
                            <div style={{
                                height: '120px', paddingTop: '40px', textAlign: 'center',
                                display: p.Arguments == null || p.Arguments.length == 0 ? 'block' : 'none'
                            }}>
                                <h4>暂无商品信息</h4>
                            </div>
                        </div>
                        <hr />
                        <PullUpIndicator
                            onRelease={() =>
                                this.isShowIntroduceView = true
                            } distance={30}
                            initText="上拉查看商品详情" readyText="释放查看商品详情" />
                    </PageView>
                    <PageView ref={(o) => { o ? this.introduceView = o.element : null }} style={{ transform: 'translateY(100%)' }}
                        panEnd={() => {
                            let prevent = false;
                            if (this.isShowProductView) {
                                this.isShowProductView = false;
                                this.showProductView();
                                prevent = true;
                            }
                            return prevent;
                        }}>
                        <PullDownIndicator
                            onRelease={() =>
                                this.isShowProductView = true
                            }
                            initText="下拉查看商品详情" readyText="释放查看商品详情" />
                        {this.state.content ?
                            <HtmlView content={this.state.content} className="container" />
                            :
                            <div className="loading">
                                <div className="spin">
                                    <i className="icon-spinner icon-spin"></i>
                                </div>
                            </div>
                        }
                    </PageView>
                    <PageFooter style={{ position: 'absolute' }}>
                        <nav>
                            <a href={'#shopping_shoppingCartNoMenu'} className="pull-left">
                                <i className="icon-shopping-cart"></i>
                                {this.state.productsCount ?
                                    <span className="badge bg-primary">{productsCount}</span>
                                    : null
                                }
                            </a>
                            <Button onClick={() => this.addToShoppingCart()} className="btn btn-primary pull-right" >加入购物车</Button>
                        </nav>
                    </PageFooter>
                    <ProductPanel ref={(o) => this.productPanel = o} parent={this} product={this.props.product} />
                </PageComponent>

            );
        }
    }

    class ProductPanel extends React.Component<{ product: Product, parent: ProductPage } & React.Props<ProductPanel>,
        { product: Product, count: number }> {

        private panel: controls.Panel;

        constructor(props) {
            super(props);
            this.state = { product: this.props.product, count: this.props.parent.state.count };
        }
        private decrease() {
            let count = this.state.count;
            if (count == 1) {
                return;
            }

            count = count - 1;
            this.state.count = count;
            this.setState(this.state);
            this.props.parent.updateProductCount(count);
        }
        private increase() {
            let count = this.state.count;
            count = count + 1;
            this.state.count = count;
            this.setState(this.state);
            this.props.parent.updateProductCount(count);
        }
        private onProductsCountInputChanged(event: Event) {
            let value = Number.parseInt((event.target as HTMLInputElement).value);
            if (!value) return;

            this.state.count = value;
            this.setState(this.state);
            this.props.parent.updateProductCount(value);
        }
        private onFieldSelected(property: CustomProperty, name: string) {
            property.Options.forEach(o => {
                o.Selected = o.Name == name
            })

            var properties: { [name: string]: string } = {};
            this.state.product.CustomProperties.forEach(o => {
                properties[o.Name] = o.Options.filter(c => c.Selected)[0].Value;
            });

            return shop.productByProperies(this.state.product.GroupId, properties)
                .then(o => {
                    this.state.product = o;
                    this.setState(this.state);
                    productStore.dispatch({ product: o, type: 'update' });
                });
        }
        show() {
            this.panel.show('right');
        }
        render() {
            let p = this.state.product;
            return (
                <Panel ref={(o) => this.panel = o}
                    header={
                        <div>
                            <nav>
                                <ul className="nav nav-tabs">
                                    <li className="text-left" style={{ width: '30%' }}>
                                        <button onClick={() => this.panel.hide()} style={{ border: 'none', padding: 10, backgroundColor: 'inherit' }}>关闭</button>
                                    </li>
                                </ul>
                            </nav>
                            <div style={{ paddingTop: "10px" }}>
                                <div className="pull-left" style={{ width: 80, height: 80, marginLeft: 10 }}>
                                    <ImageBox src={p.ImageUrl} className="img-responsive" />
                                </div>
                                <div style={{ marginLeft: 100, marginRight: 70 }}>
                                    <div>{p.Name}</div>
                                    <div className="price">￥{p.Price.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    }
                    body={
                        <div>
                            {p.CustomProperties.map(o => (
                                <div key={o.Name} className="container row">
                                    <div className="pull-left" style={{ width: 60 }}>
                                        <span>{o.Name}</span>
                                    </div>
                                    {o.Options.map(c => (
                                        <div key={c.Name} style={{ marginLeft: 60 }}>
                                            <Button onClick={() => this.onFieldSelected(o, c.Name)} className={c.Selected ? 'cust-prop selected' : 'cust-prop'}>{c.Name}</Button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    }
                    footer={
                        <div>
                            <div className="form-group">
                                <div style={{ width: 60, textAlign: 'left' }} className="pull-left">
                                    <span>数量</span>
                                </div>
                                <div style={{ marginLeft: 60 }}>
                                    <div className="input-group">
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" onClick={this.decrease.bind(this)}>
                                                <span className="icon-minus"></span>
                                            </button>
                                        </span>
                                        <input className="form-control" type="number" value={`${this.state.count}`}
                                            onChange={this.onProductsCountInputChanged.bind(this)} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" onClick={this.increase.bind(this)}>
                                                <span className="icon-plus"></span>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                            <button onClick={() => { this.props.parent.addToShoppingCart(); this.panel.hide() }} className="btn btn-primary btn-block"
                                data-dialog="toast:'成功添加到购物车'">
                                加入购物车
                        </button>
                        </div>
                    } />
            );
        }
    }

    shop.product(id).then((product) => {
        let productPage = ReactDOM.render(
            <ProductPage product={product} />,
            page.element
        )
    });

}



class PromotionComponent extends React.Component<
    { promotion: Promotion, key: any },
    { status: 'collapse' | 'expand' }>{

    constructor(props) {
        super(props);
        this.state = { status: 'collapse' };
    }

    toggle() {
        if (this.state.status == 'collapse') {
            this.state.status = 'expand';
        }
        else {
            this.state.status = 'collapse';
        }
        this.setState(this.state);
    }

    render() {
        let type = this.props.promotion.Type;
        let contents = this.props.promotion.Contents;//.map((o, i) => { o. })
        let status = this.state.status;
        return (
            <div className="media">
                <div className="media-left" >
                    <span style={{ display: type.indexOf('Given') >= 0 ? 'block' : 'none' }} className="label label-info" >满赠</span>
                    <span style={{ display: type.indexOf('Reduce') >= 0 ? 'block' : 'none' }} className="label label-success" >满减</span>
                    <span style={{ display: type.indexOf('Discount') >= 0 ? 'block' : 'none' }} className="label label-warning" >满折</span>
                </div>
                <div onClick={() => this.toggle()} className="media-body">
                    {contents.map((o, i) => (
                        <div key={i} style={{ display: status == 'expand' || i == 0 ? 'block' : 'none', margin: '0 0 8px 0' }}>
                            {o.Description}
                        </div>
                    ))}
                </div>
                {contents.length > 1 ?
                    <div onClick={() => this.toggle()} className="media-right">
                        <i className={status == 'collapse' ? "icon-chevron-down" : 'icon-chevron-up'}></i>
                    </div> : null}
            </div >
        );
    }
}

