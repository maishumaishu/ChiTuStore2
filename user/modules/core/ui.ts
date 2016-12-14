
var u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1;



class Errors {
    static argumentNull(argName: string) {
        let msg = `Argument ${argName} can not be null or empty.`;
        return new Error(msg);
    }
}


class ui {

    //================================================================================
    // 使得元素具有回弹效果，仅适用于安卓系统
    /** 使得元素顶端具有回弹效果 */
    @singlePerElement()
    static enableBounceTopForAndroid(view: HTMLElement) {
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

    static enableBounceBootomForAndroid(view: HTMLElement) {
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

    static enablePullUp(options: { view: HTMLElement, statusSwitchDistance?: number, callback?: () => void }) {
        options = options || <any>{};
        let view = options.view;
        let callback = options.callback;
        let statusSwitchDistance = options.statusSwitchDistance || 20;

        if (view == null) throw new Error('Argument view can not be null.');

        let indicator = view.querySelector('.pull-up-indicator') as HTMLElement;
        if (indicator == null) {
            throw new Error('Indicator element is not exists.');
        }

        ui.enableBounceBootomForAndroid(view);

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

    static enablePullDown(options: { view: HTMLElement, statusSwitchDistance?: number, callback?: () => void }) {
        options = options || <any>{};
        let view = options.view;
        let callback = options.callback;
        let statusSwitchDistance = options.statusSwitchDistance || 20;

        if (view == null) throw new Error('Argument view can not be null.');

        let indicator = view.querySelector('.pull-down-indicator') as HTMLElement;
        if (indicator == null) {
            throw new Error('Indicator element is not exists.');
        }

        enableBounceTopForAndroid(view);

        let beginTop: number;
        view.addEventListener('touchstart', function (event) {
            let rect = indicator.getBoundingClientRect();
            beginTop = rect.top;
        });

        view.addEventListener('touchmove', function (event) {
            console.log(`scrollTop:${view.scrollTop}`);

            let scrollOnTop = view.scrollTop <= 0;

            let rect = indicator.getBoundingClientRect();
            let currentTop = rect.top;
            let deltaHeight = currentTop - beginTop;
            if (deltaHeight > statusSwitchDistance && scrollOnTop) {
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

}

/** 使得某个方法只适用于某个元素一次 */
function singlePerElement() {
    const attrName = 'ui-func';

    /** 标记某个元素已调用了某个函数 */
    function markCalled(element: HTMLElement, funcName: string) {
        if (!element) throw Errors.arguments('element');
        if (!funcName) throw Errors.argumentNull('funcName');

        let attr = element.getAttribute(attrName) || '';
        if (attr != '')
            attr = attr + ','

        attr = attr + funcName;
        element.setAttribute(attrName, attr);
    }

    /** 标记某个元素是否调用了某个函数 */
    function isCalled(element: HTMLElement, funcName: string): boolean {
        let attr = element.getAttribute(attrName) || '';
        let names = attr.split(',').filter(o => o != '');
        return names.indexOf(funcName) >= 0;
    }

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let method = descriptor.value as Function;
        descriptor.value = function (element: HTMLElement) {
            if (isCalled(element, propertyKey))
                return;

            markCalled(element, propertyKey);
            return method.apply(this, arguments);
        }
    };
}

//================================================================================

/** 使得元素顶端具有回弹效果 */
export let enableBounceTopForAndroid = ui.enableBounceTopForAndroid;

/** 使得元素底部具有回弹效果 */
export let enableBounceBootomForAndroid = ui.enableBounceBootomForAndroid;

//================================================================================
/** 使得元素具有上拉功能 */
export let enablePullUp = ui.enablePullUp;

/** 使得元素具有下拉拉功能 */
export let enablePullDown = ui.enablePullDown; 
