import { Service, ShoppingCartService, AjaxError } from 'services';
import { Application as BaseApplication } from 'chitu.mobile';


import * as chitu from 'chitu';

/** 是否为 APP */
let isCordovaApp = location.protocol === 'file:';
/** 是否为安卓系统 */
export let isAndroid = navigator.userAgent.indexOf('Android') > -1;
/** 是否允浸入式头 */
let allowImmersionHeader = false;
let topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

const loadingClassName = 'loading';

if (isCordovaApp && !isAndroid) {
    allowImmersionHeader = true;
}

export let config = {
    // get imageText() {
    //     return imageBoxConfig.imageDisaplyText;
    // },
    // set imageText(value) {
    //     imageBoxConfig.imageDisaplyText = value;
    // },
    defaultUrl: 'home_index'
}

export class Menu extends React.Component<{ pageName: string }, { itemsCount: number }> {
    constructor(props) {
        super(props);
        this.state = { itemsCount: 0 };
    }
    componentDidMount() {
        let menuElement = this.refs['menu'] as HTMLElement;
        var activeElement = menuElement.querySelector(`[name="${this.props.pageName}"]`) as HTMLElement;
        if (activeElement) {
            activeElement.className = 'active';
        }
    }
    render() {
        return (
            <ul ref="menu" className="menu" style={{ marginBottom: '0px' }}>
                <li>
                    <a name="home.index" href="#home_index">
                        <i className="icon-home"></i>
                        <span>首页</span>
                    </a>
                </li>
                <li>
                    <a name="home.class" href="#home_class">
                        <i className="icon-th-large"></i>
                        <span>分类</span>
                    </a>
                </li>
                <li>
                    <a name="shopping.shoppingCart" href="#shopping_shoppingCart">
                        <i className="icon-shopping-cart"></i>
                        <sub name="products-count" style={{ display: this.state.itemsCount <= 0 ? 'none' : 'block' }} className="sub">
                            {this.state.itemsCount}
                        </sub>
                        <span>购物车</span>
                    </a>

                </li>
                <li>
                    <a name="home.newsList" href="#home_newsList">
                        <i className="icon-rss"></i>
                        <span>微资讯</span>
                    </a>
                </li>
                <li>
                    <a name="user.index" href="#user_index">
                        <i className="icon-user"></i>
                        <span>我</span>
                    </a>
                </li>
            </ul>
        );
    }
}

export class Page extends chitu.Page {
    private allowSwipeBackGestrue;
    private displayStatic;

    constructor(params) {
        super(params);


        let className = this.routeData.pageName.split('.').join('-');
        this.element.className = (allowImmersionHeader ? 'page immersion ' : 'page ') + className;
        this.displayStatic = topLevelPages.indexOf(this.name) >= 0 || this.name == 'home.search';

        //=========================================
        // 在 shown 加入转动，而不是一开始加，避免闪烁
        this.shown.add((sender: Page, args) => {
            let i = sender.element.querySelector('section.loading i') as HTMLElement;
            if (i)
                i.className = i.className + ' icon-spin';
        })
        //=========================================

        //===================================================
        // IOS WEB 浏览器自带滑动返回
        this.allowSwipeBackGestrue = (isCordovaApp || isAndroid) && topLevelPages.indexOf(this.routeData.pageName) < 0;
        //===================================================readonly

        this.renderLoading();
    }

    private renderLoading() {
        ReactDOM.render(
            <div>
                {this.createHeader()}
                <section className={loadingClassName}>
                    <div className="spin">
                        <i className="icon-spinner"></i>
                    </div>
                </section>
                {topLevelPages.indexOf(this.routeData.pageName) >= 0 ?
                    <footer>
                        <Menu pageName={this.name} />
                    </footer>
                    : null
                }
            </div>,
            this.element
        );
    }

    private renderError() {
        ReactDOM.render(
            <div className="norecords">
                <div className="icon">
                    <i className="icon-rss">
                    </i>
                </div>
                <h4 className="text"></h4>
                <button onClick={() => this.reload()} className="btn btn-default">点击重新加载页面</button>
            </div>, this.element
        );
    }

    private createHeader() {
        let noneHeaderPages = ['user.index'];
        if (noneHeaderPages.indexOf(this.routeData.pageName) >= 0) {
            return;
        }

        let navBar;
        switch (this.routeData.pageName) {
            case 'home.product':
                navBar = productNavBar();
                break;
            case 'home.search':
                navBar = searchNavBar();
                break;
            default:
                let isTopPage = topLevelPages.indexOf(this.routeData.pageName) >= 0;
                navBar = defaultNavBar({ showBackButton: !isTopPage });
                break;
        }

        return <header>{(navBar)}</header>;
    }

    createService<T extends Service>(serviceType: { new (): T }): T {
        let result = new serviceType();
        result.error.add((sender, error) => {
            this.showError(error);
        })
        return result;
    }

    private showError(err: Error) {
        let loadingElement = this.element.querySelector(`.${loadingClassName}`) as HTMLElement;
        if (loadingElement) {
            this.renderError();
        }
        else {
            alert(err.message);
            console.log(err);
        }
    }

    /** 判断主视图是否为活动状态 */
    private dataViewIsActive() {
        // 选取主视图后面的视图，如果有显示的，则说明为非活动状态
        let views = this.element.querySelectorAll('section[class="main"] + section');
        for (let i = 0; i < views.length; i++) {
            let view = views[i] as HTMLElement;
            let display = !view.style.display || view.style.display == 'block';
            if (display)
                return false;
        }

        return true;
    }

    reload() {
        let result = super.reload();
        this.renderLoading();
        return result;
    }
}

export class Application extends BaseApplication {
    private topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    constructor() {
        super();
        this.pageType = Page;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData);// as Page;

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        requirejs([cssPath]);

        return page;
    }
}

export let app = window['app'] = new Application();
app.run();
app.backFail.add(() => {
    app.redirect(config.defaultUrl);
});


if (!location.hash) {
    app.redirect(config.defaultUrl);
}

export function defaultNavBar(options?: { title?: string, showBackButton?: boolean, right?: JSX.Element }) {
    options = options || {};
    let title = options.title || '';
    let showBackButton = options.showBackButton == null ? true : options.showBackButton;

    return (
        <nav className="bg-primary">
            <div className="col-xs-3" style={{ padding: 0 }}>
                {showBackButton ?
                    <button name="back-button" onClick={() => app.back()} className="left-button" style={{ opacity: 1 }}>
                        <i className="icon-chevron-left"></i>
                    </button> :
                    <span></span>
                }
            </div>
            <div className="col-xs-6" style={{ padding: 0 }}>
                <h4>
                    {title}
                </h4>
            </div>
            <div className="col-xs-3" style={{ padding: 0 }}>
                {options.right ? (options.right) : null}
            </div>
        </nav>
    );
}

export function productNavBar() {
    return (
        <nav style={{ opacity: 1, backgroundColor: 'unset' }}>
            <button onClick={() => app.back()} className="leftButton">
                <i className="icon-chevron-left"></i>
            </button>
        </nav>
    );
}

export function searchNavBar() {
    return (
        <nav style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
            <button onClick={() => window['app'].back()} className="leftButton">
                <i className="icon-chevron-left"></i>
            </button>
        </nav>
    );
}

