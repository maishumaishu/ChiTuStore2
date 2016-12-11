import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { isAndroid } from 'site'


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

                if (isAndroid)
                    enablePullUpRequiredforAndroid(page.dataView);

                enablePullUp(page.dataView);
            }
        });
    })
}


function enablePullUpRequiredforAndroid(view: HTMLElement) {

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

function enablePullUp(view: HTMLElement) {
    let pullUpBar = view.querySelector('.pull-up-bar') as HTMLElement;
    let beginTop: number;
    let currentTop: number;

    let viewHeight = view.getBoundingClientRect().height;
    view.addEventListener('touchstart', function (event) {
        let rect = pullUpBar.getBoundingClientRect();
        beginTop = rect.top;
    });
    view.addEventListener('touchmove', function (event: TouchEvent) {

        let rect = pullUpBar.getBoundingClientRect();
        currentTop = rect.top;

        // deltaTop 正值为向上，
        let deltaTop = beginTop - currentTop;
        console.log(`scrollTop:${view.scrollTop}`);

        let { scrollTop, scrollHeight } = view;
        let scrollOnBottom = (scrollTop + viewHeight) >= scrollHeight;
        if (deltaTop > 20 && scrollOnBottom) {
            status('ready');
        }
        else {
            status('init');
        }
    });
    view.addEventListener('touchend', function (event) {
        // let deltaTop = currentTop - beginTop;

        // if (status() == 'ready') {
        //     page.dataView.style.transform = 'translate3d(0%,-100%,0)';
        //     page.dataView.style.transition = '0.4s';
        // }
        // console.log(`status:${status()}`);
        status('init');
    });

    type Status = 'init' | 'ready';
    let _status: Status;
    function status(value?: Status): Status {
        if (value == undefined) {
            return _status;
        }

        _status = value;
        if (_status == 'init') {
            (<HTMLElement>pullUpBar.querySelector('.ready')).style.display = 'none';
            (<HTMLElement>pullUpBar.querySelector('.init')).style.display = 'block';
        }
        else if (_status == 'ready') {
            (<HTMLElement>pullUpBar.querySelector('.ready')).style.display = 'block';
            (<HTMLElement>pullUpBar.querySelector('.init')).style.display = 'none';
        }
        return _status;
    }
}
