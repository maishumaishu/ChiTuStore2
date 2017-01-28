import BezierEasing = require('bezier-easing');
import Hammer = require('hammer');

let easing = BezierEasing(0.42, 0, 1, 1);

/** 是否为安卓系统 */
let isAndroid = navigator.userAgent.indexOf('Android') > -1;

interface ScrollViewProps extends React.Props<ScrollView> {
    className?: string
}

export class ScrollView extends React.Component<ScrollViewProps, {}>{

    element: HTMLElement;

    constructor(props) {
        super(props);
    }

    protected componentDidMount() {
        if (isAndroid) {
            let start: number;

            //======================================
            let scroller = this.element as HTMLElement;
            scroller.style.transition = '0';

            var hammer = new Hammer.Manager(scroller, { touchAction: 'auto' });
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
            let moving: 'moveup' | 'movedown' = null;

            hammer.add(pan);
            hammer.on('panmove', (event) => {
                console.log('deltaY:' + event.deltaY);
                if (scroller.scrollTop <= 0) {
                    moving = 'movedown';
                }
                else if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                    moving = 'moveup';
                }

                if (moving) {
                    this.element.style.touchAction = 'none';
                    let distance = easing(event.distance / 1000) * 1000;
                    if (moving == 'movedown') {
                        scroller.style.transform = `translateY(${distance}px)`;
                        scroller.setAttribute('data-scrolltop', `${0 - distance}`);
                    }
                    else {
                        scroller.style.transform = `translateY(-${distance}px)`;
                    }
                }
            });
            hammer.on('panup', (event) => {

            });
            hammer.on('panend', () => {
                scroller.style.removeProperty('transform');
                moving = null;
                this.element.style.touchAction = 'auto';
            })
        }
    }

    render() {
        return (
            <div className={this.props.className} ref={(o: HTMLElement) => this.element = o} style={{ width: '100%', height: '100%', overflowY: 'scroll', overflowX: 'hidden' }}>
                {React.Children.map(this.props['children'], (o) => (
                    o
                ))}
            </div>
        );
    }
}