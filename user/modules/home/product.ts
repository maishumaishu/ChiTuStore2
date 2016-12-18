import Vue = require('vue');
import { Page } from 'chitu.mobile';
import * as services from 'services';
import { isAndroid } from 'site'
import { PageView } from 'core/ui'
// enablePullUp, enablePullDown, enableBounceLeft, enableBounceRight, 
import Hammer = require('hammer');

export default function (page: Page) {
    let { id } = page.routeData.values


    let q = Promise.all([services.home.getProduct(id)]);


    page.load.add(async () => {
        let result = await q;
        let product = result[0];

        let node = page.dataView;
        let vm = new Vue({
            el: page.dataView,
            data: {
                product
            },
            computed: {
                productSelectedText
            },
            mounted
        });

        function productSelectedText() {
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
            str = str + product.Count + '件';
            return str;
        }

        async function mounted() {
            page.loadingView.style.display = 'none';


            let introduceView = createIntroduceView(page);
            let introduceView2 = createHorizontalIntroduceView(page);
            page.element.appendChild(introduceView);
            page.element.appendChild(introduceView2);
            let pageView = new PageView({
                element: page.dataView,
                right: { element: introduceView2 },
                bottom: { element: introduceView }
            });
        }
    })
}



function createIntroduceView(page: Page) {
    let introduceView = document.createElement('section');
    introduceView.style.display = 'none';
    introduceView.style.paddingTop = '0px';

    let { id } = page.routeData.values
    let loadIntroduce = services.shop.productIntroduce(id);

    chitu.loadjs('text!pages/home/product/introduce.html').then(result => {
        let html = result[0];
        introduceView.innerHTML = html;
        loadIntroduce.then(o => {
            let introduceElement = introduceView.querySelector('.container') as HTMLElement;
            introduceElement.innerHTML = o;
        });
    })

    return introduceView;
}


function createHorizontalIntroduceView(page: Page) {
    let introduceView = document.createElement('section');

    let introduceContent = document.createElement('div');
    introduceContent.className = 'container';
    introduceView.appendChild(introduceContent);

    let { id } = page.routeData.values
    let loadIntroduce = services.shop.productIntroduce(id);

    loadIntroduce.then(o => {
        introduceContent.innerHTML = o;
    });

  

    return introduceView;
}

