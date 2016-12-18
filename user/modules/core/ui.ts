
var u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1;


class Errors {
    static argumentNull(argName: string) {
        let msg = `Argument ${argName} can not be null or empty.`;
        return new Error(msg);
    }
}


class ui {
    static horizontal_swipe_angle = 35;
    static vertical_pull_angle = 65;

    static angle(x, y) {
        var d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
        return d;
    }
}

type ViewNode = {
    element: HTMLElement,
    right?: ViewNode,
    left?: ViewNode,
    bottom?: ViewNode,
    top?: ViewNode
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

export class PageView {

    switchDistances = {
        left: 150,
        top: 30,
        bottom: 30,
        right: 150
    }

    private elementTop: number;
    private elementLeft: number;

    private _currentViewNode: ViewNode;
    constructor(viewNode: ViewNode) {

        this._currentViewNode = viewNode;
        let { top, left } = getComputedStyle(viewNode.element);
        top = top == 'auto' ? '0px' : top;
        left = left == 'auto' ? '0px' : left;


        this.elementTop = new Number(top.substr(0, top.length - 2)).valueOf();
        this.elementLeft = new Number(left.substr(0, left.length - 2)).valueOf();


        viewNode.bottom.element.style.display = 'none';
        //==================================
        // init position
        let elements = this.getElements(this.currentViewNode);
        if (elements.leftElement) {
            let position = this.leftElementPosition();
            transform(elements.leftElement, position, '0s');
            elements.leftElement.style.display = 'none';
        }

        if (elements.rightElement) {
            let position = this.rightElementPosition();
            transform(elements.rightElement, position, '0s');
            elements.rightElement.style.display = 'none';
        }

        if (elements.topElement) {
            let position = this.topElementPosition();
            transform(elements.topElement, position, '0s');
            elements.topElement.style.display = 'none';
        }

        if (elements.bottomElement) {
            let position = this.bottomElementPosition();
            transform(elements.bottomElement, position, '0s');
            elements.bottomElement.style.display = 'none';
        }
        //==================================

        this.enableGesture(viewNode.element);
        this.enableGesture(viewNode.right.element);
        this.enableGesture(viewNode.bottom.element);

        viewNode.right.left = viewNode;
        viewNode.bottom.top = viewNode;
    }

    private get currentViewNode() {
        return this._currentViewNode;
    }
    private set currentViewNode(value: ViewNode) {
        this._currentViewNode = value;
    }

    private bottomElementPosition(): { left: number, top: number } {
        let left = this.elementLeft;
        let top = this.elementTop + this.currentViewNode.element.clientHeight;
        return { left, top };
    }

    private topElementPosition(): { left: number, top: number } {
        let left = this.elementLeft;
        let top = this.elementTop - this.currentViewNode.element.clientHeight;
        return { left, top };
    }

    private leftElementPosition(): Position {
        let left = this.elementLeft - this.currentViewNode.element.clientWidth;
        let top = this.elementTop;
        return { left, top };
    }

    private rightElementPosition(): Position {
        let left = this.elementLeft + this.currentViewNode.element.clientWidth;
        let top = this.elementTop;
        return { left, top };
    }

    private currentElementPosition(): Position {
        let left = this.elementLeft;
        let top = this.elementTop;
        return { left, top };
    }


    private enableGesture(element: HTMLElement) {
        let startY, currentY;
        let startX, currentX;
        let moving: 'horizontal' | 'vertical';

        let status: 'init' | 'ready';
        let action: 'pullDown' | 'pullUp' | 'swipeLeft' | 'swipeRight';

        element.addEventListener('touchstart', function (event: TouchEvent) {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
        })

        element.addEventListener('touchmove', (event: TouchEvent) => {
            currentX = event.targetTouches[0].pageX;
            currentY = event.targetTouches[0].pageY;
            let angle = ui.angle(currentX - startX, currentY - startY);
            if (angle < ui.horizontal_swipe_angle && moving != 'vertical') {
                moving = 'horizontal';
                moveHorizontal(event, currentX - startX);
            }
            else if (angle > ui.vertical_pull_angle && moving != 'horizontal') {
                moving = 'vertical';
                moveVertical(event, currentY - startY);
            }
        })


        var moveHorizontal = (event: TouchEvent, deltaX: number) => {
            let currentElement = this.currentViewNode.element;
            let rightElement: HTMLElement;
            if (this.currentViewNode.right)
                rightElement = this.currentViewNode.right.element;

            let leftElement: HTMLElement;
            if (this.currentViewNode.left)
                leftElement = this.currentViewNode.left.element;

            let left = this.elementLeft + deltaX;
            transform(currentElement, { left, top: this.elementTop }, '0s');
            if (deltaX < 0 && rightElement != null) {
                transform(rightElement, { left: left + currentElement.clientWidth, top: this.elementTop }, '0s');
                action = 'swipeLeft';
                status = Math.abs(deltaX) >= this.switchDistances.left ? 'ready' : 'init';
            }
            else if (deltaX > 0 && leftElement != null) {
                let left = deltaX - leftElement.clientWidth;
                transform(leftElement, { left, top: this.elementTop }, '0s');
                action = 'swipeRight';
                status = Math.abs(deltaX) >= this.switchDistances.right ? 'ready' : 'init';
            }
            this.disableNativeScroll(currentElement);
            event.preventDefault();
        }

        var moveVertical = (event: TouchEvent, deltaY: number) => {
            let currentElement = this.currentViewNode.element;

            let { scrollTop, scrollHeight } = currentElement;

            //=================================================
            // 实现视图的上下移动
            if (isAndroid) {
                let { scrollTop, scrollHeight, clientHeight } = currentElement;
                if ((scrollTop <= 0 && deltaY > 0) || (scrollTop >= scrollHeight - clientHeight && deltaY < 0)) {
                    //currentElement.style.transform = `translate(0px, ${this.elementTop + deltaY}px)`;
                    transform(currentElement, { left: this.elementLeft, top: this.elementTop + deltaY }, '0s');
                    event.preventDefault();
                }
            }
            //=================================================

            let readyElement: HTMLElement;
            let initElement: HTMLElement;


            if (scrollTop <= 0 && deltaY > 0) {
                let indicator: HTMLElement = this.currentViewNode.element.querySelector('.pull-down-indicator') as HTMLElement;
                if (indicator) {
                    readyElement = <HTMLElement>indicator.querySelector('.ready');
                    initElement = <HTMLElement>indicator.querySelector('.init');
                }

                status = Math.abs(deltaY) <= this.switchDistances.top ? 'init' : 'ready';
                action = 'pullDown';
            }
            else if (scrollTop + currentElement.clientHeight >= scrollHeight && deltaY < 0) {
                let indicator: HTMLElement = this.currentViewNode.element.querySelector('.pull-up-indicator') as HTMLElement;
                if (indicator) {
                    readyElement = <HTMLElement>indicator.querySelector('.ready');
                    initElement = <HTMLElement>indicator.querySelector('.init');
                }

                status = Math.abs(deltaY) <= this.switchDistances.bottom ? 'init' : 'ready';
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
            let bottomViewNode = this.currentViewNode.bottom;
            let topViewNode = this.currentViewNode.top;

            if (action == 'pullDown' && status == 'ready' && topViewNode != null) {
                this.showView(topViewNode);
            }
            else if (action == 'pullUp' && status == 'ready' && bottomViewNode != null) {
                this.showView(bottomViewNode);
            }
            else if (isAndroid) {
                transform(this.currentViewNode.element, this.currentElementPosition(), '0.4s');
            }
        }

        var endHorizontal = (event: TouchEvent, deltaX: number) => {
            let currentElement = this.currentViewNode.element;
            let elements = this.getElements(this.currentViewNode);
            this.enableNativeScroll(currentElement);
            if (action == 'swipeLeft' && status == 'ready' && this.currentViewNode != null) {
                this.showView(this.currentViewNode.right);
            }
            else if (action == 'swipeRight' && status >= 'ready' && this.currentViewNode.left != null) {
                this.showView(this.currentViewNode.left);
            }
            else {
                transform(this.currentViewNode.element, this.currentElementPosition(), '0.4s');
                if (action == 'swipeLeft') {
                    transform(elements.rightElement, this.rightElementPosition(), '0.4s')
                        .then(() => {
                            elements.rightElement.style.display = 'none';
                        });
                }
                else if (action == 'swipeRight') {
                    transform(elements.leftElement, this.leftElementPosition(), '0.4s')
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
        }

        element.addEventListener('touchcancel', (event) => end(event));
        element.addEventListener('touchend', (event) => end(event));
    }

    private getElements(viewNode: ViewNode) {
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

    showView(viewNode: ViewNode) {
        let currentViewNode = this.currentViewNode;
        let { leftElement } = this.getElements(currentViewNode);

        viewNode.element.style.display = 'block';
        let currentElementTransform: Promise<any>;
        if (viewNode == this.currentViewNode.right) {
            currentElementTransform = transform(currentViewNode.element, this.leftElementPosition(), '0.4s');
            transform(viewNode.element, this.currentElementPosition(), '0.4s');
        }
        else if (viewNode == currentViewNode.left) {
            currentElementTransform = transform(currentViewNode.element, this.rightElementPosition(), '0.4s');
            transform(viewNode.element, this.currentElementPosition(), '0.4s');
        }
        else if (viewNode == currentViewNode.bottom) {
            //======================================================================
            // 这两句的顺序不能倒过来
            currentElementTransform = transform(currentViewNode.element, this.topElementPosition(), '0.4s');
            transform(viewNode.element, this.currentElementPosition(), '0.4s');
            //======================================================================
        }
        else if (viewNode == currentViewNode.top) {
            currentElementTransform = transform(currentViewNode.element, this.bottomElementPosition(), '0.4s');
            transform(viewNode.element, this.currentElementPosition(), '0.4s');
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