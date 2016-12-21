import { Page } from 'chitu.mobile';
import Vue = require('vue');
import * as services from 'services';
import 'controls/imageBox';

export default function (page: Page) {
    let cateoriesPromise = services.shop.cateories();
    let vm = new Vue({
        el: page.dataView,
        data:{
             cateories: [],
        },
        render
    });
    
    cateoriesPromise.then(items => {
        vm.cateories = items;
        page.loadingView.style.display = 'none';
    })

    function render(h) {
        return (
            <section class="main">
                <div class="row">
                    {this.cateories.map(item => (
                        <a href={`#home_productList?categoryId=${item.Id}`} class="col-xs-3">
                            <image-box src={item.ImagePath}></image-box>
                            <span class="mini interception">{item.Name}</span>
                        </a>
                    ))}
                </div>
            </section>
        );
    }
}