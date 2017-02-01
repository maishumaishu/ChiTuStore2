namespace controls {
    let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0

    export interface PanelProps extends React.Props<Panel> {
        header?: JSX.Element;
        body?: JSX.Element;
        footer?: JSX.Element;
    }
    export class Panel extends React.Component<PanelProps, {}>{

        private panel: HTMLElement;
        private modalDialog: HTMLElement;
        private header: HTMLElement;
        private body: HTMLElement;
        private footer: HTMLElement;
        private modal: HTMLElement;
        private backdrop: HTMLElement;

        constructor(props) {
            super(props);
        }
        show(from: 'left' | 'right' | 'top' | 'bottom') {
            let header = this.header; //this.refs['header'] as HTMLElement;
            let body = this.body; //this.refs['body'] as HTMLElement;
            let footer = this.footer; //this.refs['footer'] as HTMLElement;
            let panel = this.panel; //this.refs['panel'] as HTMLElement;
            let modal = this.modal; //this.refs['modal'] as HTMLElement;
            let backdrop = this.backdrop; //this.refs['backdrop'] as HTMLElement;

            panel.style.display = 'block';
            modal.style.display = 'block';

            window.setTimeout(() => {
                modal.style.transform = 'translateX(0)';
                backdrop.style.opacity = '0.5';
            }, 50);

            console.assert(header != null && body != null && footer != null);
            let setBodyHeight = () => {
                let headerHeight = header.getBoundingClientRect().height;
                let footerHeight = footer.getBoundingClientRect().height;
                let bodyHeight = window.innerHeight - headerHeight - footerHeight;
                body.style.height = `${bodyHeight}px`;
            };
            window.addEventListener('resize', () => setBodyHeight());
            setBodyHeight();
        }
        hide() {
            this.modal.style.removeProperty('transform');
            this.backdrop.style.opacity = '0';
            window.setTimeout(() => {
                this.panel.style.display = 'none';
            }, 500);
        }
        protected componentDidMount() {
            //=====================================================================
            // 点击非窗口区域，关窗口。并禁用上级元素的 touch 操作。
            let panel = this.panel; //this.refs['panel'] as HTMLElement;
            let modalDialog = this.modalDialog; //this.refs['modalDialog'] as HTMLElement;
            panel.addEventListener('touchstart', (event) => {
                let dialogRect = modalDialog.getBoundingClientRect();
                for (let i = 0; i < event.touches.length; i++) {
                    let {clientX} = event.touches[i];
                    if (clientX < dialogRect.left) {
                        this.hide();
                        return;
                    }
                }
            });

            if (isIOS) {
                panel.addEventListener('touchstart', (event) => {
                    let tagName = (event.target as HTMLElement).tagName;
                    if (tagName == 'BUTTON' || tagName == 'INPUT' || tagName == 'A') {
                        return;
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
            }
        }
        render() {
            return <div ref={(o: HTMLElement) => this.panel = o} className="product-panel">
                <div ref={(o: HTMLElement) => this.modal = o} className="modal">
                    <div ref={(o: HTMLElement) => this.modalDialog = o} className="modal-dialog">
                        <div className="modal-content">
                            {this.props.header ?
                                <div ref={(o: HTMLElement) => this.header = o} className="modal-header">
                                    {this.props.header}
                                </div>
                                : null
                            }
                            {this.props.body ?
                                <div ref={(o: HTMLElement) => this.body = o} className="modal-body">
                                    {this.props.body}
                                </div>
                                : null
                            }
                            {this.props.footer ?
                                <div ref={(o: HTMLElement) => this.footer = o} className="modal-footer">
                                    {this.props.footer}
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div ref={(o: HTMLElement) => this.backdrop = o} className="modal-backdrop in">
                </div>
            </div>;
        }
        render1() {
            return <div ref="panel" className="product-panel">
                <div ref="modal" className="modal">
                    <div ref="modalDialog" className="modal-dialog">
                        <div className="modal-content">
                            <div ref="header" className="modal-header">
                                {this.props.header}
                            </div>
                            <div ref="body" className="modal-body">
                                {this.props.body}
                            </div>
                            <div ref="footer" className="modal-footer">
                                {this.props.footer}
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="backdrop" className="modal-backdrop in">
                </div>
            </div>;
        }
    }

}