import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { isAndroid } from 'site'


export default function (page: Page) {
    let { id } = page.routeData.values


    let q = Promise.all([services.home.getProduct(id)]);

    let introduceElement = document.createElement('section');
    page.element.appendChild(introduceElement);
    introduceElement.innerHTML = '<h1 style="margin-top:200px;">产品介绍</h1></br>';
    introduceElement.style.transform = 'translate3d(0%,100%,0)';
    introduceElement.style.display = 'none';

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

                if (isAndroid) {
                    enableBounceBootomForAndroid(page.dataView);
                    enableBounceTopForAndroid(page.dataView);
                }

                enablePullUp({
                    view: page.dataView,
                    callback() {
                        introduceElement.style.display = 'block';
                        //==========================================
                        // 要有延时，才有动画效果
                        window.setTimeout(() => {
                            introduceElement.style.transform = 'translate3d(0%, 0%, 0)';
                            introduceElement.style.transition = '0.4s';
                        }, 50);
                        //==========================================

                        page.dataView.style.transform = 'translate3d(0%,-100%,0)';
                        page.dataView.style.transition = '0.4s';
                    }
                });
            }
        });
    })
}

//================================================================================
// 使得元素具有回弹效果，仅适用于安卓系统
function enableBounceBootomForAndroid(view: HTMLElement) {

    let topString = getComputedStyle(view).top;
    let viewStartTop = new Number(topString.substr(0, topString.length - 2)).valueOf();
    let startY;
    view.addEventListener('touchstart', function (event) {
        startY = event.touches[0].pageY;
    });

    view.addEventListener('touchmove', function (event) {

        let { scrollTop, scrollHeight } = view;
        let scrollOnBottom = (scrollTop + view.clientHeight) >= scrollHeight;

        //===================================
        // deltaY 负数表示向上移动，现在只考虑这种情况
        let deltaY = event.touches[0].pageY - startY;

        if (scrollOnBottom && deltaY < 0) {
            console.log('scrollOnBottom');

            let viewCurrentTop = viewStartTop + deltaY / 2;
            view.style.top = viewCurrentTop + 'px';

            let rect = view.getBoundingClientRect();
            console.log(`top:${rect.top}`);

            //===================================
            // 禁用原来的滚动
            event.preventDefault();
            //===================================
        }
    });

    view.addEventListener('touchend', function (event) {
        view.style.top = viewStartTop + 'px';
        view.style.overflowY = 'scroll';
    });
}
//================================================================================

function enablePullUp(options: { view: HTMLElement, statusSwitchDistance?: number, callback?: () => void }) {

    options = options || <any>{};
    let view = options.view;
    let callback = options.callback;
    let statusSwitchDistance = options.statusSwitchDistance || 20;

    if (view == null) throw new Error('Argument view can not be null.');

    let indicator = view.querySelector('.pull-up-indicator') as HTMLElement;
    if (indicator == null) {
        throw new Error('Indicator element is not exists.');
    }

    let beginTop: number;
    let currentTop: number;

    let viewHeight = view.getBoundingClientRect().height;
    view.addEventListener('touchstart', function (event) {
        let rect = indicator.getBoundingClientRect();
        beginTop = rect.top;
    });
    view.addEventListener('touchmove', function (event: TouchEvent) {

        let rect = indicator.getBoundingClientRect();
        currentTop = rect.top;

        let deltaTop = beginTop - currentTop;

        let { scrollTop, scrollHeight } = view;
        let scrollOnBottom = (scrollTop + viewHeight) >= scrollHeight;

        if (deltaTop > statusSwitchDistance && scrollOnBottom) {
            status('ready');
        }
        else {
            status('init');
        }
    });
    view.addEventListener('touchend', function (event) {

        if (status() == 'ready' && callback != null) {
            callback();
        }
        status('init');
    });

    type Status = 'init' | 'ready';
    let _status: Status;
    function status(value?: Status): Status {
        if (value == undefined) {
            return _status;
        }

        _status = value;

        let readyElement = <HTMLElement>indicator.querySelector('.ready');
        let initElement = <HTMLElement>indicator.querySelector('.init');
        if (_status == 'init') {
            if (readyElement)
                readyElement.style.display = 'none';

            if (initElement)
                initElement.style.display = 'block';
        }
        else if (_status == 'ready') {
            if (readyElement)
                readyElement.style.display = 'block';

            if (initElement)
                initElement.style.display = 'none';
        }
        return _status;
    }
}

function enableBounceTopForAndroid(view: HTMLElement) {
    if (!isAndroid) {
        return;
    }

    let topString = getComputedStyle(view).top;
    let viewStartTop = new Number(topString.substr(0, topString.length - 2)).valueOf();
    let startY;
    view.addEventListener('touchstart', function (event) {
        startY = event.touches[0].pageY;
    });

    view.addEventListener('touchmove', function (event) {

        let { scrollTop, scrollHeight } = view;
        //let scrollOnBottom = (scrollTop + view.clientHeight) >= scrollHeight;

        //===================================
        // deltaY 正数表示向上移动，现在只考虑这种情况
        let deltaY = event.touches[0].pageY - startY;

        if (scrollTop <= 0 && deltaY > 0) {
            let viewCurrentTop = viewStartTop + deltaY / 2;
            view.style.top = viewCurrentTop + 'px';
            //===================================
            // 禁用原来的滚动
            event.preventDefault();
            //===================================
        }
    });

    view.addEventListener('touchend', function (event) {
        view.style.top = viewStartTop + 'px';
        view.style.overflowY = 'scroll';
    });
}

function enablePullDown() {

}
