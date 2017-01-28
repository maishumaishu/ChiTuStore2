
import Hammer = require('hammer');
let isAndroid = navigator.userAgent.indexOf('Android') > -1;

type IndicatorStatus = 'init' | 'ready';
interface IndicatorProps {
    scroller?: HTMLElement,
    onRelease?: () => void,
    initText?: string,
    readyText?: string,
    distance?: number
}

//const defaultDistance = 50;
let defaultIndicatorProps = {} as IndicatorProps;
defaultIndicatorProps.distance = 50;

export class PullUpIndicator extends React.Component<IndicatorProps, { status: IndicatorStatus }>{

    private element: HTMLElement;

    constructor(props: IndicatorProps) {

        super(props);
        this.state = { status: 'init' };
    }

    componentDidMount() {
        let indicator = this.element; //this.refs['pull-up-indicator'] as HTMLElement;
        let viewElement = this.props.scroller || this.element.parentElement;
        console.assert(viewElement != null);

        let preventDefault = false;
        let start = false;
        let startY: number;

        let manager = new Hammer.Manager(viewElement);
        manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
        manager.on('panstart', (event) => {
            if (viewElement.scrollTop + viewElement.clientHeight >= viewElement.scrollHeight)
                start = true;
            else
                start = false;
        });

        //let MAX_DISTANCE = 200;
        viewElement.addEventListener('touchmove', (event) => {
            if (!start) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
                return;
            }

            let currentY = indicator.getBoundingClientRect().top;
            if (startY == null) {
                startY = currentY;
                return;
            }

            let status = null;
            let deltaY = currentY - startY;
            let distance = 0 - Math.abs(this.props.distance);
            if (deltaY < distance && this.state.status != 'ready') {
                status = 'ready';
            }
            else if (deltaY > distance && this.state.status != 'init') {
                status = 'init';
            }

            if (status != null) {
                //=================================
                // 延时设置，避免卡
                window.setTimeout(() => {
                    preventDefault = true;
                    this.state.status = status;
                    this.setState(this.state);
                }, 100);
                //=================================
                // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                window.setTimeout(() => preventDefault = false, 200);
                //=================================
            }
        });

        manager.on('panend', () => {
            if (this.state.status == 'ready' && this.props.onRelease != null) {
                this.props.onRelease();
            }
            //=================================
            // 延时避免在 IOS 下闪烁
            window.setTimeout(() => {
                preventDefault = false;
                startY = null;
                start = false;
                this.state.status = 'init';
                this.setState(this.state);
            }, 200);
            //=================================
        });
    }

    render() {
        return (
            <div className="pull-up-indicator" ref={(o: HTMLElement) => this.element = o}>
                <div className="init" style={{ display: this.state.status == 'init' ? 'block' : 'none' }}>
                    <i className="icon-chevron-up"></i>
                    <span>{this.props.initText}</span>
                </div>
                <div className="ready" style={{ display: this.state.status == 'ready' ? 'block' : 'none' }}>
                    <i className="icon-chevron-down"></i>
                    <span>{this.props.readyText}</span>
                </div>
            </div>
        );
    }
}

PullUpIndicator.defaultProps = defaultIndicatorProps;

export class PullDownIndicator extends React.Component<IndicatorProps, { status: IndicatorStatus }>{

    private element: HTMLElement;

    constructor(props: IndicatorProps) {

        super(props);
        this.state = { status: 'init' };
    }

    componentDidMount() {
        let indicator = this.element;
        let viewElement = this.props.scroller || this.element.parentElement;
        console.assert(viewElement != null);

        let preventDefault = false;
        let manager = new Hammer.Manager(viewElement);
        manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
        viewElement.addEventListener('touchmove', (event) => {
            let scrollTop = isAndroid ? Number.parseInt(viewElement.getAttribute('data-scrolltop')) : viewElement.scrollTop;
            if (scrollTop >= 0) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
                return;
            }

            let currentY = indicator.getBoundingClientRect().top;
            let status = null;

            let distance = 0 - Math.abs(this.props.distance);
            if (scrollTop < distance && this.state.status != 'ready') {
                status = 'ready';
            }
            else if (scrollTop > distance && this.state.status != 'init') {
                status = 'init';
            }

            if (status != null) {
                //=================================
                // 延时设置，避免卡
                window.setTimeout(() => {
                    preventDefault = true;
                    this.state.status = status;
                    this.setState(this.state);
                }, 100);
                //=================================
                // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                window.setTimeout(() => preventDefault = false, 200);
                //=================================
            }
        });

        manager.on('panend', () => {
            if (this.state.status == 'ready' && this.props.onRelease != null) {
                this.props.onRelease();
            }
            //=================================
            // 延时避免在 IOS 下闪烁
            window.setTimeout(() => {
                preventDefault = false;
                // startY = null;
                // start = false;
                this.state.status = 'init';
                this.setState(this.state);
            }, 200);
            //=================================
        });
    }

    render() {
        return (
            <div className="pull-down-indicator" ref={(o: HTMLElement) => this.element = o}>
                <div className="init" style={{ display: this.state.status == 'init' ? 'block' : 'none' }}>
                    <i className="icon-chevron-down"></i>
                    <span>{this.props.initText}</span>
                </div>
                <div className="ready" style={{ display: this.state.status == 'ready' ? 'block' : 'none' }}>
                    <i className="icon-chevron-up"></i>
                    <span>{this.props.readyText}</span>
                </div>
            </div>
        );
    }
}

PullDownIndicator.defaultProps = defaultIndicatorProps;
