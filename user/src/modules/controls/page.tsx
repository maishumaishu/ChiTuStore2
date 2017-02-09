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

    /** 是否为安卓系统 */
    export class PageView extends React.Component<React.Props<PageView> & {
        className?: string, style?: React.CSSProperties, panEnd?: () => boolean
    }, {}>{

        static tagName = 'SECTION';

        element: HTMLElement;

        //onPanEnd: () => boolean;

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
            hammer.on('panmove', (event) => {
                console.log('deltaY:' + event.deltaY);
                if (scroller.scrollTop == 0) {
                    moving = 'movedown';
                }
                else if (scroller.scrollTop + scroller.clientHeight == scroller.scrollHeight) {
                    moving = 'moveup';
                }
                else if ((scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight) || scroller.scrollTop < 0) {
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
                    }
                    else if (moving == 'overscroll') {
                        scroller.setAttribute('data-scrolltop', `${scroller.scrollTop}`);
                    }
                }
            });
            hammer.on('panup', (event) => {

            });
            hammer.on('panend', () => {
                if (!moving) {
                    return;
                }

                moving = null;
                this.element.style.touchAction = 'auto';

                let preventDefault = this.props.panEnd != null ? this.props.panEnd() : false;
                if (preventDefault) {
                    return;
                }
                scroller.style.removeProperty('transform');
            });

            let startY: number;
            scroller.addEventListener('touchstart', (event) => {
                startY = event.touches[0].clientY;
            })
            scroller.addEventListener('touchmove', (event) => {
                let deltaY = event.touches[0].clientY - startY;
                if (deltaY < 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else if (deltaY > 0 && scroller.scrollTop <= 0) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            })
            //}
        }

        render() {
            let children = getChildren(this.props);
            return (
                <section ref={(o: HTMLElement) => this.element = o} className={this.props.className} style={this.props.style}>
                    {children.map(o => (o))}
                </section>
            );
        }
    }
}