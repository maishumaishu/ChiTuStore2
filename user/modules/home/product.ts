import { Page } from 'chitu.mobile';
import * as services from 'services';
import { isAndroid } from 'site'
import { enablePullUp, enablePullDown } from 'core/ui'

export default function (page: Page) {
    let { id } = page.routeData.values


    let q = Promise.all([services.home.getProduct(id)]);

    page.load.add(async () => {
        let result = await q;
        let product = result[0];
        let data = {
            product
        };

        let vm = new Vue({
            el: page.dataView,
            data,
            computed: {
                productSelectedText: function () {
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
            },
            mounted() {
                page.loadingView.style.display = 'none';
                enablePullUp({
                    view: page.dataView,
                    statusSwitchDistance: 30,
                    async callback() {
                        let introduceView = await createIntroduceView(page);
                        page.element.appendChild(introduceView);
                        viewUp(page.dataView, introduceView);
                    }
                });
            }
        });
    })
}

function viewUp(currentView: HTMLElement, nextView: HTMLElement) {

    nextView.style.display = 'block';
    nextView.style.transform = 'translate(0%, 100%)';

    //==========================================
    // 要有延时，才有动画效果, 
    window.setTimeout(() => {
        nextView.style.transform = 'translate(0%, 0%)';
        nextView.style.transition = '0.4s';
    }, 50);
    //==========================================

    currentView.style.transform = 'translate(0%, -100%)';
    currentView.style.transition = '0.4s';

    //==========================================
    // 比动画时间 0.4s 略大
    let playEnd = new Promise<any>(function (reslove, reject) {
        window.setTimeout(reslove, 500);
    });

    playEnd.then(() => {
        currentView.style.display = 'none';
    })
}

function viewDown(currentView: HTMLElement, previousView: HTMLElement) {
    previousView.style.display = 'block';
    previousView.style.transform = 'translate(0%, -100%)';

    //==========================================
    // 要有延时，才有动画效果, 
    window.setTimeout(() => {
        previousView.style.transform = 'translate(0%, 0%)';
        previousView.style.transition = '0.4s';
    }, 50);
    //==========================================

    currentView.style.transform = 'translate(0%, 100%)';
    currentView.style.transition = '0.4s';

    //==========================================
    // 比动画时间 0.4s 略大
    let playEnd = new Promise<any>(function (reslove, reject) {
        window.setTimeout(reslove, 500);
    });

    playEnd.then(() => {
        currentView.style.display = 'none';
    })
}


async function createIntroduceView(page: Page) {
    let introduceView = document.createElement('section');
    introduceView.style.display = 'none';
    introduceView.style.paddingTop = '0px';


    let { id } = page.routeData.values
    let loadIntroduce = services.shop.productIntroduce(id);

    let result = await chitu.loadjs('text!pages/home/product/introduce.html');
    //[0] as string;
    let html = result[0];
    introduceView.innerHTML = html;
    enablePullDown({
        view: introduceView,
        statusSwitchDistance: 50,
        callback: function () {
            viewDown(introduceView, page.dataView);
        }
    });

    loadIntroduce.then(o => {
        let introduceElement = introduceView.querySelector('.container') as HTMLElement;
        introduceElement.innerHTML = o;
    });

    return introduceView;
}

