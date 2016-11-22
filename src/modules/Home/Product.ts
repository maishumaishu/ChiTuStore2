import { Page, action } from 'chitu.mobile';
import * as services from 'services';




export default action((page: Page) => {
    let { id } = page.routeData.values


    return Promise.all([services.home.getProduct(id), chitu.loadjs('Controls/ImageView')]).then(results => {
        let product = results[0];
        let vm = new Vue({
            el: page.mainView,
            data: {
                product
            },
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
            mounted: () => {
                on_mounted();
            }
        })
    });

    function on_mounted() {
        let pullUpBar = page.element.querySelector('.pull-up-bar') as HTMLElement;
        let beginTop: number;
        let currentTop: number;
        page.mainView.addEventListener('touchstart', function (event) {
            let rect = pullUpBar.getBoundingClientRect();
            beginTop = rect.top;
        });
        page.mainView.addEventListener('touchmove', function (event) {
            let rect = pullUpBar.getBoundingClientRect();
            currentTop = rect.top;
            let deltaTop = beginTop - currentTop;
            if (deltaTop > 20) {
                status('ready');
            }
            else {
                status('init');
            }
        });
        page.mainView.addEventListener('touchend', function (event) {
            let deltaTop = currentTop - beginTop;
            if (status() == 'ready') {

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

        // function setStatus(status: 'init' | 'ready' | 'finish' | 'cancel') {

        // }
    }
});


            // window.setTimeout(() => {
            //     let bar = page.mainView.querySelector('[name="buttonBar"]') as HTMLElement;
            //     page.mainView.ontouchstart = function (event: TouchEvent) {
            //         console.log('Touch Start');
            //     };

            //     page.mainView.ontouchmove = function (event: TouchEvent) {
            //         console.log('Touch Move');
            //         let rect = bar.getBoundingClientRect();
            //         let y = rect.top;
            //         console.log(`scrollTop:${y}`);
            //     }

            //     page.mainView.ontouchend = function (event: TouchEvent) {
            //         console.log('Touch End');
            //     }
            // }, 10);