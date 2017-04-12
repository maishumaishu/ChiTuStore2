import BezierEasing = require('bezier-easing');


let easing = BezierEasing(0.25, 0.1, 0.25, 1);

let isAndroid = navigator.userAgent.indexOf('Android') > -1;


class Errors {
    static argumentNull(argName: string) {
        let msg = `Argument ${argName} can not be null or empty.`;
        return new Error(msg);
    }
}


type PageViewNode = {
    element: HTMLElement,
    right?: RightViewNode,
    left?: LeftViewNode,
    bottom?: BottomViewNode,
    top?: TopviewNode
}

type LeftViewNode = {
    element: HTMLElement,
    top?: TopviewNode,
    left?: LeftViewNode,
    bottom?: BottomViewNode
}

type RightViewNode = {
    element: HTMLElement,
    top?: TopviewNode,
    right?: RightViewNode,
    bottom?: BottomViewNode
}

type BottomViewNode = {
    element: HTMLElement,
    left?: LeftViewNode,
    right?: RightViewNode,
    bottom?: BottomViewNode,
}

type TopviewNode = {
    element: HTMLElement,
    left?: LeftViewNode,
    right?: RightViewNode,
    top?: TopviewNode
}

type Position = { left: number, top: number };

function transform(element: HTMLElement, position: Position, time: '0s' | '0.4s') {
    element.style.display = 'block';
    element.style.transform = `translate(${position.left}px,${position.top}px)`;
    element.style.transition = time;

    return new Promise(reslove => {
        if (time == '0s') {
            reslove();
            return;
        }

        window.setTimeout(() => {
            reslove();
        }, 500);
    })
}

export class PageViewGesture {

    switchDistances = {
        left: 150,
        top: 50,
        bottom: 20,
        right: 150
    }

    private elementTop: number;
    private elementLeft: number;

    private positions: {
        left: Position,
        right: Position,
        top: Position,
        bottom: Position,
        current: Position
    }

    private _currentViewNode: PageViewNode;
    constructor(viewNode: PageViewNode) {

        this._currentViewNode = viewNode;
        let { top, left } = getComputedStyle(viewNode.element);
        top = top == 'auto' ? '0px' : top;
        left = left == 'auto' ? '0px' : left;


        this.elementTop = new Number(top.substr(0, top.length - 2)).valueOf();
        this.elementLeft = new Number(left.substr(0, left.length - 2)).valueOf();

        let {clientWidth, clientHeight} = viewNode.element;
        this.positions = {
            left: { left: this.elementLeft - clientWidth, top: this.elementTop },
            top: { left: this.elementLeft, top: this.elementTop - clientHeight },
            right: { left: this.elementLeft + clientWidth, top: this.elementTop },
            bottom: { left: this.elementLeft, top: this.elementTop + clientHeight },
            current: { left: this.elementLeft, top: this.elementTop },
        }

        let stack = new Array<PageViewNode>();
        stack.push(viewNode);
        while (stack.length > 0) {
            let item = stack.pop();
            item['visited'] = true;
            if (item.left && !item.left['visited']) {
                stack.push(item.left as PageViewNode);
                (item.left as PageViewNode).right = item;
            }
            if (item.top && !item.top['visited']) {
                stack.push(item.top as PageViewNode);
                (item.top as PageViewNode).bottom = item;
            }
            if (item.right && !item.right['visited']) {
                stack.push(item.right as PageViewNode);
                (item.right as PageViewNode).left = item;
            }
            if (item.bottom && !item.bottom['visited']) {
                stack.push(item.bottom as PageViewNode);
                (item.bottom as PageViewNode).top = item;
            }

            this.enableGesture(item);
        }

        viewNode.bottom.element.style.display = 'none';
        //==================================
        // init position
        let elements = this.getElements(this.currentViewNode);
        if (elements.leftElement) {
            transform(elements.leftElement, this.positions.left, '0s');
            elements.leftElement.style.display = 'none';
        }

        if (elements.rightElement) {
            transform(elements.rightElement, this.positions.right, '0s');
            elements.rightElement.style.display = 'none';
        }

        if (elements.topElement) {
            transform(elements.topElement, this.positions.top, '0s');
            elements.topElement.style.display = 'none';
        }

        if (elements.bottomElement) {
            transform(elements.bottomElement, this.positions.bottom, '0s');
            elements.bottomElement.style.display = 'none';
        }
        //==================================
    }

    private get currentViewNode() {
        return this._currentViewNode;
    }
    private set currentViewNode(value: PageViewNode) {
        this._currentViewNode = value;
    }


    private enableGesture(viewNode: PageViewNode) {
        let startY: number, currentY: number, stepY: number;
        let startX: number, currentX: number;
        let moving: 'horizontal' | 'vertical';

        let status: 'init' | 'ready';
        let action: 'pullDown' | 'pullUp' | 'swipeLeft' | 'swipeRight';


        let horizontal_swipe_angle = 35;
        let vertical_pull_angle = 65;
        let elementCurrentTop: number = this.elementTop;

        viewNode.element.addEventListener('touchstart', function (event: TouchEvent) {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
        })

        viewNode.element.addEventListener('touchmove', (event: TouchEvent) => {
            stepY = currentY == null ? event.targetTouches[0].pageY - startY : event.targetTouches[0].pageY - currentY;

            currentX = event.targetTouches[0].pageX;
            currentY = event.targetTouches[0].pageY;
            //========================================
            // 表示侧划
            if (currentX < 0) {
                return;
            }
            //========================================
            let angle = calculateAngle(currentX - startX, currentY - startY);
            if (angle < horizontal_swipe_angle && moving != 'vertical') {
                moving = 'horizontal';
                moveHorizontal(event, currentX - startX);
                if (action)
                    event.stopPropagation();
            }
            else if (angle > vertical_pull_angle && moving != 'horizontal') {
                moving = 'vertical';
                moveVertical(event, currentY - startY);
            }

            let {scrollTop, scrollHeight, clientHeight} = viewNode.element;
            if ((currentY - startY >= 0 && scrollTop <= 0) || (currentY - startY <= 0 && scrollTop >= scrollHeight - clientHeight) || action != null) {
                event.preventDefault();
            }

        })

        var calculateAngle = (x, y) => {
            let d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
            return d;
        }

        var moveHorizontal = (event: TouchEvent, deltaX: number) => {
            let currentElement = viewNode.element;

            let {rightElement, leftElement} = this.getElements(viewNode);

            let left = this.elementLeft + deltaX;
            if (deltaX < 0 && rightElement != null) {
                action = 'swipeLeft';

                transform(currentElement, { left, top: this.elementTop }, '0s');
                transform(rightElement, { left: left + currentElement.clientWidth, top: this.elementTop }, '0s');
                status = Math.abs(deltaX) >= this.switchDistances.left ? 'ready' : 'init';
            }
            else if (deltaX > 0 && leftElement != null) {
                action = 'swipeRight';
                let left = deltaX - leftElement.clientWidth;
                transform(currentElement, { left: deltaX, top: this.elementTop }, '0s');
                transform(leftElement, { left, top: this.elementTop }, '0s');
                status = Math.abs(deltaX) >= this.switchDistances.right ? 'ready' : 'init';
            }
            this.disableNativeScroll(currentElement);
        }


        let readyElement: HTMLElement;
        let initElement: HTMLElement;

        var moveVertical = (event: TouchEvent, deltaY: number) => {
            let currentElement = viewNode.element;

            let { scrollTop, scrollHeight } = currentElement;

            if (scrollTop <= 0 && deltaY > 0) {
                let indicator: HTMLElement = viewNode.element.querySelector('.pull-down-indicator') as HTMLElement;
                if (indicator) {
                    readyElement = indicator.querySelector('.ready') as HTMLElement;
                    initElement = indicator.querySelector('.init') as HTMLElement;
                }

                elementCurrentTop = elementCurrentTop + east(stepY, deltaY);
                transform(currentElement, { left: this.elementLeft, top: elementCurrentTop }, '0s');
                status = Math.abs(elementCurrentTop - this.elementTop) <= this.switchDistances.top ? 'init' : 'ready';
                action = 'pullDown';
            }
            else if (scrollTop + currentElement.clientHeight >= scrollHeight && deltaY < 0) {
                let indicator: HTMLElement = viewNode.element.querySelector('.pull-up-indicator') as HTMLElement;
                if (indicator) {
                    readyElement = indicator.querySelector('.ready') as HTMLElement;
                    initElement = indicator.querySelector('.init') as HTMLElement;
                }

                elementCurrentTop = elementCurrentTop + east(stepY, deltaY);
                transform(currentElement, { left: this.elementLeft, top: elementCurrentTop }, '0s');
                status = Math.abs(elementCurrentTop - this.elementTop) <= this.switchDistances.bottom ? 'init' : 'ready';
                action = 'pullUp';
            }

            if (status == 'init' && initElement != null && readyElement != null) {
                initElement.style.display = 'block';
                readyElement.style.display = 'none';
            }
            else if (status == 'ready' && initElement != null && readyElement != null) {
                initElement.style.display = 'none';
                readyElement.style.display = 'block';
            }
        }

        var endVertical = (event: TouchEvent, deltaY: number) => {
            let bottomViewNode = viewNode.bottom;
            let topViewNode = viewNode.top;

            if (action == 'pullDown' && status == 'ready' && topViewNode != null) {
                this.showView(topViewNode);
            }
            else if (action == 'pullUp' && status == 'ready' && bottomViewNode != null) {
                this.showView(bottomViewNode);
            }
            else {
                transform(viewNode.element, this.positions.current, '0.4s');
            }

            if (readyElement != null && initElement != null) {
                initElement.style.display = 'block';
                readyElement.style.display = 'none';
            }
        }

        var endHorizontal = (event: TouchEvent, deltaX: number) => {
            let currentElement = viewNode.element;
            let elements = this.getElements(viewNode);
            this.enableNativeScroll(currentElement);
            if (action == 'swipeLeft' && status == 'ready' && viewNode != null) {
                this.showView(viewNode.right);
            }
            else if (action == 'swipeRight' && status >= 'ready' && viewNode.left != null) {
                this.showView(viewNode.left);
            }
            else {
                transform(viewNode.element, this.positions.current, '0.4s');
                if (action == 'swipeLeft' && elements.rightElement != null) {
                    transform(elements.rightElement, this.positions.right, '0.4s')
                        .then(() => {
                            elements.rightElement.style.display = 'none';
                        });
                }
                else if (action == 'swipeRight' && elements.leftElement != null) {
                    transform(elements.leftElement, this.positions.left, '0.4s')
                        .then(() => {
                            elements.leftElement.style.display = 'none';
                        });
                }
            }
        }

        let end = (event) => {
            if (moving == 'vertical') {
                endVertical(event, currentY - startY);
            }
            else if (moving == 'horizontal') {
                endHorizontal(event, currentX - startX);
            }
            moving = null;
            action = null;
            status = null;
            elementCurrentTop = null;
        }

        function east(step, deltaY) {
            let MAX_Y = 300;
            if (deltaY >= MAX_Y)
                return 0;

            let r = easing(Math.abs(deltaY) / MAX_Y);
            let result = r * step;
            console.log(`radio ${r}`);
            return result;
        }

        viewNode.element.addEventListener('touchcancel', (event) => end(event));
        viewNode.element.addEventListener('touchend', (event) => end(event));
    }

    private getElements(viewNode: PageViewNode) {
        let leftElement: HTMLElement;
        let rightElement: HTMLElement;
        let topElement: HTMLElement;
        let bottomElement: HTMLElement;
        if (this.currentViewNode.left) {
            leftElement = this.currentViewNode.left.element;
        }
        if (this.currentViewNode.right) {
            rightElement = this.currentViewNode.right.element;
        }
        if (this.currentViewNode.top) {
            topElement = this.currentViewNode.top.element;
        }
        if (this.currentViewNode.bottom) {
            bottomElement = this.currentViewNode.bottom.element;
        }

        return {
            leftElement,
            rightElement,
            topElement,
            bottomElement
        };
    }

    showView(viewNode: PageViewNode) {
        let currentViewNode = this.currentViewNode;
        let { leftElement } = this.getElements(currentViewNode);

        viewNode.element.style.display = 'block';
        let currentElementTransform: Promise<any>;
        if (viewNode == this.currentViewNode.right) {
            currentElementTransform = transform(currentViewNode.element, this.positions.left, '0.4s');
            transform(viewNode.element, this.positions.current, '0.4s');
        }
        else if (viewNode == currentViewNode.left) {
            currentElementTransform = transform(currentViewNode.element, this.positions.right, '0.4s');
            transform(viewNode.element, this.positions.current, '0.4s');
        }
        else if (viewNode == currentViewNode.bottom) {
            //======================================================================
            // 这两句的顺序不能倒过来
            currentElementTransform = transform(currentViewNode.element, this.positions.top, '0.4s');
            window.setTimeout(() => {
                transform(viewNode.element, this.positions.current, '0.4s');
            }, 50);
            //======================================================================
        }
        else if (viewNode == currentViewNode.top) {
            currentElementTransform = transform(currentViewNode.element, this.positions.bottom, '0.4s');
            window.setTimeout(() => {
                transform(viewNode.element, this.positions.current, '0.4s');
            }, 50)
        }

        console.assert(currentElementTransform != null);
        currentElementTransform.then(() => {
            currentViewNode.element.style.display = 'none';
        })

        this.currentViewNode = viewNode;
    }

    /** 禁用原生的滚动 */
    private disableNativeScroll(element: HTMLElement) {
        element.style.overflowY = 'hidden';
    }

    /** 启用原生的滚动 */
    private enableNativeScroll(element: HTMLElement) {
        element.style.overflowY = 'scroll';
    }
}

// export function buttonOnClick(callback: (event: Event, ...args: any[]) => Promise<any>) {
//     return function (event: Event, ...args: any[]) {
//         let button = (event.target as HTMLButtonElement);
//         button.setAttribute('disabled', '');
//         let p = callback(event, ...args);
//         p.then(() => button.removeAttribute('disabled'))
//             .catch(() => button.removeAttribute('disabled'));
//     }
// }

//export const imageText = '';

