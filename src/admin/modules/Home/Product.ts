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
                window.setTimeout(() => {
                    let viewTop = page.mainView.querySelector('.view-top') as HTMLElement;
                    new HorizontalViewSwitchBar(viewTop, page.mainView.querySelector('.pull-up-bar') as HTMLElement)
                }, 20);
            }
        })
    });



    function on_mounted() {
        let pullUpBar = page.mainView.querySelector('.pull-up-bar') as HTMLElement;
        let beginTop: number;
        let currentTop: number;

        let viewHeight = page.mainView.getBoundingClientRect().height;
        page.mainView.addEventListener('touchstart', function (event) {
            let rect = pullUpBar.getBoundingClientRect();
            beginTop = rect.top;
        });
        page.mainView.addEventListener('touchmove', function (event) {
            let rect = pullUpBar.getBoundingClientRect();
            currentTop = rect.top;
            let deltaTop = beginTop - currentTop;
            console.log(`scrollTop:${page.mainView.scrollTop}`);

            let { scrollTop, scrollHeight } = page.mainView;
            let scrollOnBottom = (scrollTop + viewHeight) >= scrollHeight;
            if (deltaTop > 20 && scrollOnBottom) {
                status('ready');
            }
            else {
                status('init');
            }
        });
        page.mainView.addEventListener('touchend', function (event) {
            let deltaTop = currentTop - beginTop;

            if (status() == 'ready') {
                page.mainView.style.transform = 'translate3d(0%,-100%,0)';
                page.mainView.style.transition = '0.4s';
            }
            console.log(`status:${status()}`);
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
});

class HorizontalViewSwitchBar {
    private barElement: HTMLElement;
    private view: HTMLElement;
    //private bottomViewElement: HTMLElement;
    private viewHeight: number;
    private barBeginTop: number;
    private barCurrentTop: number;

    private barStatus: 'init' | 'ready' = 'init';

    constructor(view: HTMLElement, barElement) {
        this.view = view;
        this.barElement = barElement;
        this.viewHeight = view.getBoundingClientRect().height;

        view.addEventListener('touchstart', (event) => this.topView_touchstart(event));
        view.addEventListener('touchmove', (event) => this.topview_touchmove(event));
        view.addEventListener('touchend', (event) => this.topView_touchend(event));
    }

    private topView_touchstart(event: TouchEvent) {
        let rect = this.barElement.getBoundingClientRect();
        this.barBeginTop = rect.top;
    }

    private topview_touchmove(event: TouchEvent) {
        let rect = this.barElement.getBoundingClientRect();
        this.barCurrentTop = rect.top;
        let deltaTop = this.barBeginTop - this.barCurrentTop;

        let { scrollTop, scrollHeight } = this.view;
        let scrollOnBottom = (scrollTop + this.viewHeight) >= scrollHeight;
        if (deltaTop > 20 && scrollOnBottom) {
            this.status = 'ready';
        }
        else {
            this.status = 'init';
        }
    }

    private set status(value: 'init' | 'ready') {
        this.barStatus = value;
        if (value == 'init') {
            (<HTMLElement>this.barElement.querySelector('.ready')).style.display = 'none';
            (<HTMLElement>this.barElement.querySelector('.init')).style.display = 'block';
        }
        else if (value == 'ready') {
            (<HTMLElement>this.barElement.querySelector('.ready')).style.display = 'block';
            (<HTMLElement>this.barElement.querySelector('.init')).style.display = 'none';
        }
    }

    private get status() {
        return this.barStatus;
    }

    private topView_touchend(event: TouchEvent) {

        if (this.status == 'ready') {

            // (<HTMLElement>this.view.nextElementSibling).style.display = 'block';

            // window.setTimeout(() => {
                this.view.style.transform = 'translate3d(0%,-100%,0)';
                this.view.style.transition = '0.4s';

                (<HTMLElement>this.view.nextElementSibling).style.transform = 'translate3d(0%,-50px,0)';
                (<HTMLElement>this.view.nextElementSibling).style.transition = '0.4s';
                
                window.setTimeout(()=>{ // (<HTMLElement>this.view.nextElementSibling).style.display = 'block';

            // window.setTimeout(() => {
                    (<HTMLElement>this.view.nextElementSibling).scrollTop = 0;
                },600);

            // }, 50);
        }
        this.status = 'init';
        // this.direction = this.direction == 'up' ? 'down' : 'up';
    }
}


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