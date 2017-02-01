import { Page } from 'site';
//import Vue = require('vue');
import { ShopService, StationService, ProductCategory } from 'services';
import { ImageBox } from 'controls/imageBox';

export default function (page: Page) {
    let shop = page.createService(ShopService);

    class ClassView extends React.Component<{}, { cateories: ProductCategory[] }>{
        constructor(props) {
            super(props);
            this.state = { cateories: [] };
            shop.cateories().then(items => {
                this.state.cateories = items;
                this.setState(this.state);
                page.loadingView.style.display = 'none';
            })
        }
        render() {
            return (
                <div className="row">
                    {this.state.cateories.map(item => (
                        <a key={item.Id} href={`#home_productList?categoryId=${item.Id}`} className="col-xs-3">
                            <ImageBox src={item.ImagePath} />
                            <span className="mini interception">{item.Name}</span>
                        </a>
                    ))}
                </div>
            );
        }
    }

    ReactDOM.render(<ClassView />, page.dataView);
}
