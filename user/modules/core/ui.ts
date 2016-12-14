
var u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1;


class Errors {
    static argumentNull(argName: string) {
        let msg = `Argument ${argName} can not be null or empty.`;
        return new Error(msg);
    }
}


class ui {
    private static horizontal_swipe_angle = 35;
    private static vertical_pull_angle = 65;

    private static angle(x, y) {
        var d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
        return d;
    }

    //================================================================================
    // 使得元素具有回弹效果，仅适用于安卓系统
    /** 使得元素顶端具有回弹效果 */
    @singlePerElement()
    static enableBounceTopForAndroid(view: HTMLElement) {
        return ui.enableverticalBounceForAndroid(view, 'top');
    }

    static enableBounceBootomForAndroid(view: HTMLElement) {
        return ui.enableverticalBounceForAndroid(view, 'bottom');
    }

    private static enableverticalBounceForAndroid(view: HTMLElement, side: 'top' | 'bottom') {
        if (!isAndroid) {
            return;
        }

        let topString = getComputedStyle(view).top;
        let viewStartTop = new Number(topString.substr(0, topString.length - 2)).valueOf();
        let startY;
        let startX;
        view.addEventListener('touchstart', function (event) {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
        });

        view.addEventListener('touchmove', function (event) {

            let { scrollTop, scrollHeight } = view;
            let scrollOnBottom = (scrollTop + view.clientHeight) >= scrollHeight;

            //===================================
            // deltaY 负数表示向上移动，现在只考虑这种情况
            let deltaY = event.touches[0].pageY - startY;
            let condition = side == 'bottom' ?
                scrollTop >= scrollHeight - view.clientHeight && deltaY < 0 :
                scrollTop <= 0 && deltaY > 0;

            if (condition) {
                console.log('scrollOnBottom');

                let viewCurrentTop = viewStartTop + deltaY / 2;
                view.style.top = viewCurrentTop + 'px';

                //===================================
                // 禁用原来的滚动
                event.preventDefault();
                //===================================
            }
        });

        let end = function (event) {
            view.style.top = viewStartTop + 'px';
        };
        view.addEventListener('touchend', end);
        view.addEventListener('touchcancel', end);
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

    @singlePerElement()
    static enableBounceLeft(view: HTMLElement) {
        return ui.enableHorizontalBounce(view, 'left');
    }

    @singlePerElement()
    static enableBounceRight(view: HTMLElement) {
        return ui.enableHorizontalBounce(view, 'right');
    }

    static enableHorizontalBounce(view: HTMLElement, side: 'left' | 'right') {
        let startX: number;
        let startY: number;
        let viewLeftString = getComputedStyle(view).left;
        if (viewLeftString == 'auto')
            viewLeftString = '0px';

        let moving = false;
        let viewLeft = new Number(viewLeftString.substring(0, viewLeftString.length - 2)).valueOf();

        view.addEventListener('touchstart', function (event) {
            startX = event.targetTouches[0].pageX;
            startY = event.targetTouches[0].pageY;
        });

        view.addEventListener('touchmove', function (event) {
            if (moving) {
                event.preventDefault();
            }

            let rect = view.getBoundingClientRect();
            let currentX = event.targetTouches[0].pageX;
            let currentY = event.targetTouches[0].pageY;
            let deltaX = currentX - startX;// 正数向右

            let angle = ui.angle(currentX - startX, currentY - startY);
            let allowMove = angle < ui.horizontal_swipe_angle;
            if (!allowMove)
                return;

            if ((side == 'left' && deltaX > 0) || (side == 'right' && deltaX < 0)) {
                let left = viewLeft + deltaX;
                view.style.left = left + 'px';
                moving = true;
            }
        });

        let end = function (event) {
            view.style.left = viewLeftString;
            moving = false;
        }
        view.addEventListener('touchend', end);
        view.addEventListener('touchcancel', end);
    }

    @singlePerElement()
    static swipeLeft(options: { view: HTMLElement, statusSwitchDistance?: number, callback?: () => void }) {
        options = options || <any>{};

        if (!options.view)
            throw Errors.argumentNull('options.view');

        let startLeft: number;
        options.view.addEventListener('touchstart', function (event) {
            let rect = options.view.getBoundingClientRect();
            startLeft = rect.left;
        });

        options.view.addEventListener('touchmove', function (event) {
            let rect = options.view.getBoundingClientRect();
        });
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

export let enableBounceLeft = ui.enableBounceLeft;

export let enableBounceRight = ui.enableBounceRight;