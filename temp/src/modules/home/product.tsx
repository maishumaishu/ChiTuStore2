import { ShoppingCartService, imageUrl, ShopService, Product } from 'services';
import { Page, config, app } from 'site';
import { imageDelayLoad, ImageBox } from 'controls/imageBox';
import { PullUpIndicator, PullDownIndicator } from 'controls/indicators';
import { HtmlView } from 'controls/htmlView';
import { ScrollView } from 'controls/scrollView';
import { createStore } from 'redux';
import cm = require('chitu.mobile');
import BezierEasing = require('bezier-easing');
import { Panel } from 'controls/panel';

export default async function (page: Page) {

    var productView: ProductView;

    let countStore = createStore((count: number = 1, args: { type: 'increase' | 'decrease' | 'assign', value?: number }) => {
        if (args.type == 'increase') {
            return count + 1;
        }
        else if (args.type == 'decrease') {
            if (count == 1)
                return count;

            return count - 1;
        }
        else if (args.type == 'assign') {
            return args.value;
        }
        else {
            return count;
        }
    });

    interface ProductPageState {
        productSelectedText: string,
        pullUpStatus: 'init' | 'ready'
    }

    let shop = page.createService(ShopService);
    let shoppingCart = page.createService(ShoppingCartService);
    let { id } = page.routeData.values

    let introduceElement = document.createElement(cm.viewTagName);
    page.element.appendChild(introduceElement);
    introduceElement.style.transform = `translateY(100%)`;

    let panelElement = document.createElement('div');
    page.element.appendChild(panelElement);

    let productPanel: ProductPanel;
    let viewFooter: ProductViewFooter;

    class ProductView extends React.Component<{ product: Product }, ProductPageState>{

        scrollView: ScrollView;

        constructor(props) {
            super(props);
            this.state = { productSelectedText: this.productSelectedText(), pullUpStatus: 'init' };
            countStore.subscribe(() => {
                this.state.productSelectedText = this.productSelectedText();
                this.setState(this.state);
            })
        }
        private showPanel() {
            productPanel.show();
        }
        productSelectedText() {
            var str = '';
            var props = this.props.product.CustomProperties;
            for (var i = 0; i < props.length; i++) {
                var options = props[i].Options;
                for (var j = 0; j < options.length; j++) {
                    if (options[j].Selected) {
                        str = str + options[j].Name + ' ';
                        break;
                    }
                }
            }
            str = str + countStore.getState() + '件';
            return str;
        }
        private showIntroduceView() {
            page.dataView.style.transform = `translateY(-100%)`;
            page.dataView.style.transition = `0.4s`;
            setTimeout(() => {
                introduceElement.style.transform = `translateY(0)`;
                introduceElement.style.transition = `0.4s`;
            }, 500);
        }
        render() {
            let p = this.props.product;
            return (
                <ScrollView ref={(o) => this.scrollView = o}>
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
                    <PullUpIndicator onRelease={this.showIntroduceView} distance={30}
                        initText="上拉查看商品详情" readyText="释放查看商品详情" />
                </ScrollView>

            );
        }
    }

    class IntroduceView extends React.Component<{ productId: string }, { content: string }>{
        constructor(props) {
            super(props);
            this.state = { content: '' };
            shop.productIntroduce(this.props.productId).then((content) => {
                this.state.content = content;
                this.setState(this.state);

                let imgs = introduceElement.querySelectorAll('img');
                for (let i = 0; i < imgs.length; i++) {
                    let img = imgs.item(i) as HTMLImageElement;
                    img.src = imageUrl(img.src);
                    imageDelayLoad(img, config.imageText);
                }
            });
        }
        private showProductView() {
            page.dataView.style.transform = `translateY(0)`;
            page.dataView.style.transition = `0.4s`;

            introduceElement.style.transform = `translateY(100%)`;
            introduceElement.style.transition = `0.4s`;
        }
        render() {
            return (
                <ScrollView>
                    <PullDownIndicator onRelease={this.showProductView}
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
                </ScrollView>
            );
        }
    }

    ReactDOM.render(<IntroduceView productId={id} />, introduceElement);

    class ProductViewHeader extends React.Component<{ product: Product }, { isFavored: boolean }>{
        constructor(props) {
            super(props);
            this.state = { isFavored: false };

            shop.isFavored(this.props.product.Id).then((isFavored) => {
                this.state.isFavored = isFavored;
                this.setState(this.state);
            })
        }
        private favor() {
            let p: (productId: string) => Promise<any>
            if (this.state.isFavored) {
                p = shop.unfavorProduct;
            }
            else {
                p = shop.favorProduct;
            }

            p.bind(shop)(this.props.product.Id).then(o => {
                this.state.isFavored = !this.state.isFavored;
                this.setState(this.state);
            })
        }
        componentDidMount() {
            let buttons = page.header.querySelectorAll('nav button');
            let title = page.header.querySelector('nav.bg-primary') as HTMLElement;

            productView.scrollView.element.addEventListener('scroll', function (event) {
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
        render() {
            let p = this.props.product;
            return (
                <div>
                    <nav className="bg-primary"></nav>
                    <nav>
                        <button onClick={() => app.back()} className="leftButton">
                            <i className="icon-chevron-left"></i>
                        </button>
                        <button className="rightButton" onClick={() => this.favor()}>
                            <i className="icon-heart-empty" style={{ fontWeight: `800`, fontSize: `20px`, display: !this.state.isFavored ? 'block' : 'none' }} ></i>
                            <i className="icon-heart" style={{ display: this.state.isFavored ? 'block' : 'none' }}></i>
                        </button>
                    </nav>
                </div>);
        }
    }

    class ProductPanel extends React.Component<{ product: Product }, { Count: number }> {

        private panel: Panel;

        constructor(props) {
            super(props);
            this.state = { Count: countStore.getState() };
            countStore.subscribe(() => {
                this.state = { Count: countStore.getState() };
                this.setState(this.state);
            });
        }

        show() {
            this.panel.show('right');
        }
        render() {
            let p = this.props.product;
            return (
                <Panel ref={(o: Panel) => this.panel = o}
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
                                            <button className={c.Selected ? 'cust-prop selected' : 'cust-prop'}>{c.Name}</button>
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
                                            <button className="btn btn-default" onClick={() => countStore.dispatch({ type: 'decrease' })}>
                                                <span className="icon-minus"></span>
                                            </button>
                                        </span>
                                        <input className="form-control" type="number" value={`${this.state.Count}`}
                                            onChange={(e) => countStore.dispatch({ type: 'assign', value: Number.parseInt((e.target as HTMLInputElement).value) })} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" onClick={() => countStore.dispatch({ type: 'increase' })}>
                                                <span className="icon-plus"></span>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                            <button onClick={() => { addToShoppingCart(); this.panel.hide() } } className="btn btn-primary btn-block"
                                data-dialog="toast:'成功添加到购物车'">
                                加入购物车
                        </button>
                        </div>
                    } />
            );
        }
    }

    class ProductViewFooter extends React.Component<{}, { productsCount: number }>{
        constructor() {
            super();
            this.state = { productsCount: 0 };
            this.update();
        }
        update() {
            shoppingCart.productsCount().then(count => {
                this.state.productsCount = count;
                this.setState(this.state);
            })
        }
        render() {
            let productsCount = this.state.productsCount;
            return (
                <nav>
                    <span className="pull-left">
                        <i className="icon-shopping-cart"></i>
                        <span className="badge bg-primary" style={{ display: productsCount ? 'block' : 'none' }}>{productsCount}</span>
                    </span>
                    <button onClick={() => addToShoppingCart()} className="btn btn-primary pull-right" >加入购物车</button>
                </nav>
            );
        }
    }


    console.assert(page.footer != null);
    shop.product(id).then((product) => {
        page.loadingView.style.display = 'none';
        productView = ReactDOM.render(
            <ProductView product={product} />,
            page.dataView
        )
        ReactDOM.render(
            <ProductViewHeader product={product} />,
            page.header
        )

        productPanel = ReactDOM.render(
            <ProductPanel product={product} />,
            panelElement
        );

        viewFooter = ReactDOM.render(<ProductViewFooter />, page.footer);
    });

    function addToShoppingCart() {
        shoppingCart.addItem(id, countStore.getState()).then(r => {
            viewFooter.update();
        });
    }


}

