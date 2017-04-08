namespace controls {
    function getChildren(props): Array<any> {
        props = props || {};
        let children = [];
        if (props['children'] instanceof Array) {
            children = props['children'];
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }

    export class PageComponent extends React.Component<{}, {}>{
        render() {
            let children = getChildren(this.props);
            let header = children.filter(o => o instanceof PageHeader)[0];
            let footer = children.filter(o => o instanceof PageFooter)[0];
            let bodies = children.filter(o => !(o instanceof PageHeader) && !(o instanceof PageFooter));
            let views = children.filter(o => o instanceof PageView);
            return (
                <div>
                    {header != null ? (header) : null}
                    {bodies.map(o => (o))}
                    {footer != null ? (footer) : null}
                </div>
            );
        }
    }

    export class PageHeader extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}> {
        static tagName = 'HEADER';
        element: HTMLElement;

        render() {
            let children = getChildren(this.props);
            return (
                <header ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                    {children.map(o => (o))}
                </header>
            );
        }
    }

    export class PageFooter extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}>{
        static tagName = 'FOOTER';
        element: HTMLElement;

        render() {
            let children = getChildren(this.props);
            return (
                <footer ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                    {children.map(o => (o))}
                </footer>
            );
        }
    }

    let easing = BezierEasing(0, 0, 1, 0.5);



    interface PageViewProps extends React.Props<PageView> {
        className?: string, style?: React.CSSProperties,
        //panEnd?: () => boolean,
        pullDownIndicator?: { initText: string, readyText: string, distance?: number, onRelease?: () => void }
        pullUpIndicator?: { initText: string, readyText: string, distance?: number, onRelease?: () => void }
    }

    /** 是否为安卓系统 */
    export class PageView extends React.Component<PageViewProps, {}>{
        private pullDownIndicator: PullDownIndicator;
        private pullUpIndicator: PullUpIndicator;

        static tagName = 'SECTION';

        element: HTMLElement;

        iosAppComponentDidMount() {

        }
        protected componentDidMount() {
            if (isIOS && isCordovaApp) {
                this.iosAppComponentDidMount();
                return;
            }

            let start: number;

            //======================================
            let scroller = this.element as HTMLElement;
            scroller.style.transition = '0';

            let hammer = createHammerManager(scroller);;
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
            let moving: 'moveup' | 'movedown' | 'overscroll' = null;

            hammer.add(pan);
            hammer.on('panstart', (event) => {
                scroller.style.transition = '0s';
            })

            let panVertical = (event) => {
                console.log('deltaY:' + event.deltaY);
                if (scroller.scrollTop == 0 && (event.direction & Hammer.DIRECTION_DOWN) == Hammer.DIRECTION_DOWN) {
                    moving = 'movedown';
                }
                else if (scroller.scrollTop + scroller.clientHeight == scroller.scrollHeight &&
                    (event.direction & Hammer.DIRECTION_UP) == Hammer.DIRECTION_UP) {
                    moving = 'moveup';
                }
                else if ((scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight) || scroller.scrollTop < 0) {//FOR IOS
                    moving = 'overscroll';
                }

                if (moving) {
                    let distance = easing(event.distance / 1000) * 1000;
                    if (moving == 'movedown') {
                        scroller.style.transform = `translateY(${distance}px)`;
                        scroller.setAttribute('data-scrolltop', `${0 - distance}`);
                    }
                    else if (moving == 'moveup') {
                        scroller.style.transform = `translateY(-${distance}px)`;
                        scroller.setAttribute('data-scrolltop', `${scroller.scrollTop + distance}`);
                    }
                    else if (moving == 'overscroll') {//FOR IOS
                        scroller.setAttribute('data-scrolltop', `${scroller.scrollTop}`);
                    }
                }
            };
            hammer.on('panup', panVertical);
            hammer.on('pandown', panVertical);

            let end = () => {
                if (!moving) {
                    return;
                }

                this.element.style.touchAction = 'auto';
                scroller.removeAttribute('data-scrolltop');

                // let pullDownRelease: () => void;
                // let pullUpRelease: () => void;
                // if (moving == 'movedown' && this.props.pullDownIndicator) {
                //     pullDownRelease = this.props.pullDownIndicator.onRelease;
                // }
                // else if (moving == 'moveup' && this.props.pullUpIndicator) {
                //     pullUpRelease = this.props.pullUpIndicator.onRelease;
                // }

                if (moving == 'movedown' && this.pullDownIndicator != null && this.pullDownIndicator.status == 'ready') {
                    this.onRelease('pullDown');
                }
                else if (moving == 'moveup' && this.pullUpIndicator != null && this.pullUpIndicator.status == 'ready') {
                    this.onRelease('pullUp');
                }
                else {
                    this.resetPosition();
                }


                moving = null;
            }

            hammer.on('pancancel', end);
            hammer.on('panend', end);

            let startY: number;
            scroller.addEventListener('touchstart', (event) => {
                startY = event.touches[0].clientY;
            })
            scroller.addEventListener('touchmove', (event) => {
                let deltaY = event.touches[0].clientY - startY;
                if (deltaY < 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                    event.preventDefault();
                }
                else if (deltaY > 0 && scroller.scrollTop <= 0) {
                    event.preventDefault();
                }
            })
        }

        private onRelease(action: 'pullDown' | 'pullUp') {
            if (action == 'pullDown' && this.props.pullDownIndicator.onRelease != null) {
                this.props.pullDownIndicator.onRelease();
            }
            else if (action == 'pullUp' && this.props.pullUpIndicator.onRelease != null) {
                this.props.pullUpIndicator.onRelease();
            }
            else {
                this.resetPosition();
            }
        }

        resetPosition() {
            this.element.style.removeProperty('transform');
        }

        slide(direction: 'up' | 'down' | 'origin') {
            this.element.style.transition = `0.4s`;
            if (direction == 'down') {
                this.element.style.transform = `translateY(100%)`;
            }
            else if (direction == 'up') {
                this.element.style.transform = `translateY(-100%)`;
            }
            else if (direction == 'origin') {
                this.element.style.transform = `translateY(0)`;
            }
        }

        render() {
            let children = getChildren(this.props);
            let pullDownIndicator: JSX.Element = null;
            let pullUpIndicator: JSX.Element = null;
            if (this.props.pullDownIndicator) {
                let p = this.props.pullDownIndicator;
                pullDownIndicator =
                    <PullDownIndicator initText={p.initText}
                        readyText={p.readyText}
                        distance={p.distance}
                        ref={(o) => this.pullDownIndicator = o}>
                    </PullDownIndicator>
            }
            if (this.props.pullUpIndicator) {
                let p = this.props.pullUpIndicator;
                pullUpIndicator =
                    <PullUpIndicator initText={p.initText}
                        readyText={p.readyText}
                        distance={p.distance}
                        ref={(o) => this.pullUpIndicator = o}>
                    </PullUpIndicator>
            }
            return (
                <section ref={(o: HTMLElement) => this.element = o} className={this.props.className} style={this.props.style}>
                    {pullDownIndicator}
                    {children.map(o => (o))}
                    {pullUpIndicator}
                </section>
            );
        }
    }
}