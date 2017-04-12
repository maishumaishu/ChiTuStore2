import { Page, defaultNavBar, Menu } from 'site';
import { ShoppingService, StationService, ProductCategory } from 'services';
// import { ImageBox } from 'controls/imageBox';
// import { PageComponent, PageHeader, PageFooter } from 'controls/page';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox } = controls;

export default function (page: Page) {
    let shop = page.createService(ShoppingService);

    class ClassPage extends React.Component<{ cateories: ProductCategory[] }, {}>{
        constructor(props) {
            super(props);
            this.state = { cateories: [] };

        }
        render() {
            return (
                <div className="row">
                    {this.props.cateories.map(item => (
                        <a key={item.Id} href={`#home_productList?categoryId=${item.Id}`} className="col-xs-3">
                            <ImageBox src={item.ImagePath} />
                            <span className="mini interception">{item.Name}</span>
                        </a>
                    ))}
                </div>
            );
        }
    }

    shop.cateories().then(items => {
        ReactDOM.render(
            <PageComponent>
                <PageHeader>
                    <nav className="bg-primary">
                        <a href="#Home_Search" className="search">
                            <div name="search_box" className="form-control" style={{ borderWidth: 0, borderRadius: 4 }}>
                                寻找商品、品牌、品类
                            </div>
                            <div className="search-icon">
                                <i className="icon-search"></i>
                            </div>
                        </a>
                    </nav>
                </PageHeader>
                <PageFooter>
                    <Menu pageName={page.name} />
                </PageFooter>
                <PageView className="main">
                    <ClassPage cateories={items} />
                </PageView>
            </PageComponent>, page.element);
    })


}
