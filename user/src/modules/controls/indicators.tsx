namespace controls {

    let isAndroid = navigator.userAgent.indexOf('Android') > -1;

    type IndicatorStatus = 'init' | 'ready';
    interface IndicatorProps {
        initText?: string,
        readyText?: string,
        distance?: number
    }

    let defaultIndicatorProps = {} as IndicatorProps;
    defaultIndicatorProps.distance = 50;

    export class PullUpIndicator extends React.Component<IndicatorProps & React.Props<PullUpIndicator>, {}>{//, { status: IndicatorStatus }

        private element: HTMLElement;
        private initElement: HTMLElement;
        private readyElement: HTMLElement;
        private _status: IndicatorStatus;

        constructor(props: IndicatorProps) {

            super(props);
            this.state = {};//
        }

        public get status(): IndicatorStatus {
            if (!this.initElement.style.display || this.initElement.style.display == 'block') {
                return 'init';
            }

            return 'ready';
        }

        public set status(value: IndicatorStatus) {
            if (this._status == value)
                return;

            this._status = value;

            if (this._status == 'init') {
                this.initElement.style.display = 'block';
                this.readyElement.style.display = 'none';
            }
            else {
                this.initElement.style.display = 'none';
                this.readyElement.style.display = 'block';
            }
        }


        componentDidMount() {
            let indicator = this.element; //this.refs['pull-up-indicator'] as HTMLElement;
            let viewElement = this.element.parentElement;
            console.assert(viewElement != null);
            this.status = 'init';

            let preventDefault = false;
            let start = false;
            let startY: number;

            let manager = createHammerManager(viewElement); //new Hammer.Manager(viewElement, { touchAction: 'auto' });
            manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
            manager.on('panstart', (event) => {
                if (viewElement.scrollTop + viewElement.clientHeight >= viewElement.scrollHeight)
                    start = true;
                else
                    start = false;
            });

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

                let status: IndicatorStatus = null;
                let deltaY = currentY - startY;
                let distance = 0 - Math.abs(this.props.distance);
                if (deltaY < distance && this.status != 'ready') {
                    status = 'ready';
                }
                else if (deltaY > distance && this.status != 'init') {
                    status = 'init';
                }

                if (status != null) {
                    //=================================
                    // 延时设置，避免卡
                    //window.setTimeout(() => {
                    preventDefault = true;
                    this.status = status;
                    //this.setState(this.state);
                    //}, 100);
                    //=================================
                    // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                    window.setTimeout(() => preventDefault = false, 200);
                    //=================================
                }
            });

            manager.on('panend', () => {
                // if (this.onBottom) {
                //     if (this.status == 'ready' && this.props.onRelease != null) {
                //         this.props.onRelease();
                //     }
                //     else if (this.status == 'init' && this.props.onCancel != null) {
                //         this.props.onCancel();
                //     }
                // }

                //=================================
                // 延时避免在 IOS 下闪烁
                window.setTimeout(() => {
                    preventDefault = false;
                    startY = null;
                    start = false;
                    this.status = 'init';
                    //     this.setState(this.state);
                }, 100);
                //=================================
            });
        }

        private get onBottom() {
            return this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight;
        }
        //style={{ display: this.state.status == 'init' ? 'block' : 'none' }}
        //style={{ display: this.state.status == 'ready' ? 'block' : 'none' }}
        render() {
            return (
                <div className="pull-up-indicator" ref={(o: HTMLElement) => this.element = o}>
                    <div className="init" ref={(o: HTMLElement) => this.initElement = o}>
                        <i className="icon-chevron-up"></i>
                        <span>{this.props.initText}</span>
                    </div>
                    <div className="ready" ref={(o: HTMLElement) => this.readyElement = o} >
                        <i className="icon-chevron-down"></i>
                        <span>{this.props.readyText}</span>
                    </div>
                </div>
            );
        }
    }

    PullUpIndicator.defaultProps = defaultIndicatorProps;
    //{ status: IndicatorStatus }
    export class PullDownIndicator extends React.Component<IndicatorProps & React.Props<PullDownIndicator>, {}>{

        private element: HTMLElement;
        private initElement: HTMLElement;
        private readyElement: HTMLElement;
        private _status: IndicatorStatus;

        constructor(props: IndicatorProps) {

            super(props);
            this.state = {};
        }

        public get status(): IndicatorStatus {
            if (!this.initElement.style.display || this.initElement.style.display == 'block') {
                return 'init';
            }

            return 'ready';
        }

        public set status(value: IndicatorStatus) {
            if (this._status == value)
                return;

            this._status = value;
            if (this._status == 'init') {
                this.initElement.style.display = 'block';
                this.readyElement.style.display = 'none';
            }
            else {
                this.initElement.style.display = 'none';
                this.readyElement.style.display = 'block';
            }
        }

        componentDidMount() {
            let indicator = this.element;
            let viewElement = this.element.parentElement;
            console.assert(viewElement != null);
            this.status = 'init'

            let preventDefault = false;
            let manager = createHammerManager(viewElement); //new Hammer.Manager(viewElement);
            manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
            viewElement.addEventListener('touchmove', (event) => {
                let scrollTopString = viewElement.getAttribute('data-scrolltop');
                let scrollTop = scrollTopString ? Number.parseInt(scrollTopString) : viewElement.scrollTop;
                if (scrollTop >= 0) {
                    return;
                }

                if (preventDefault) {
                    event.preventDefault();
                    return;
                }

                let currentY = indicator.getBoundingClientRect().top;
                let status: IndicatorStatus = null;

                let distance = 0 - Math.abs(this.props.distance);
                if (scrollTop < distance && this.status != 'ready') {
                    status = 'ready';
                }
                else if (scrollTop > distance && this.status != 'init') {
                    status = 'init';
                }

                if (status != null) {
                    //=================================
                    // 延时设置，避免卡
                    // window.setTimeout(() => {
                    preventDefault = true;
                    this.status = status;
                    //     //this.setState(this.state);
                    // }, 100);
                    //=================================
                    // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                    window.setTimeout(() => preventDefault = false, 200);
                    //=================================
                }
            });

            manager.on('panend', () => {
                //=================================
                // 延时避免在 IOS 下闪烁
                window.setTimeout(() => {
                    //     preventDefault = false;
                    this.status = 'init';
                    //this.setState(this.state);
                }, 100);
                //=================================
            });
        }

        private get onTop() {
            return this.element.scrollTop <= 0;
        }

        render() {
            return (
                <div className="pull-down-indicator" ref={(o: HTMLElement) => this.element = o}>
                    <div className="init" ref={(o: HTMLElement) => this.initElement = o}>
                        <i className="icon-chevron-down"></i>
                        <span>{this.props.initText}</span>
                    </div>
                    <div className="ready" ref={(o: HTMLElement) => this.readyElement = o}>
                        <i className="icon-chevron-up"></i>
                        <span>{this.props.readyText}</span>
                    </div>
                </div>
            );
        }
    }

    PullDownIndicator.defaultProps = defaultIndicatorProps;

}