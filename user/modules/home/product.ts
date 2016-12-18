import Vue = require('vue');
import { Page } from 'chitu.mobile';
import * as services from 'services';
import * as site from 'site'
import { PageViewGesture, imageDelayLoad } from 'core/ui'
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
            let pageView = new PageViewGesture({
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
            let imgs = introduceElement.querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                let img = imgs.item(i) as HTMLImageElement;
                img.src = services.imageUrl(img.src);
                imageDelayLoad(img, site.config.imageText);
            }
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
        let imgs = introduceContent.querySelectorAll('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs.item(i) as HTMLImageElement;
            img.src = services.imageUrl(img.src);
            imageDelayLoad(img, site.config.imageText);
        }
    });



    return introduceView;
}

