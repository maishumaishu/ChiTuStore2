namespace controls {

    interface ButtonProps extends React.Props<Button> {
        onClick?: (event: React.MouseEvent) => Promise<any>,
        confirm?: string,
        className?: string,
        style?: React.CSSProperties,
        disabled?: boolean,
    }

    function findPageView(p: HTMLElement): HTMLElement {
        while (p) {
            let attr = p.getAttribute('data-reactroot');
            if (attr != null) {
                return p;
            }

            p = p.parentElement;
        }

        return null;
    }

    export class Button extends React.Component<ButtonProps, {}>{

        private buttonElement: HTMLButtonElement;
        private _doing: boolean;
        //private confirmDialog: ConfirmDialog;
        private dialogElement: HTMLElement;
        private animateTime: number;
        private currentClickEvent: React.MouseEvent;

        private onClick(e: React.MouseEvent) {
            this.currentClickEvent = e;
            if (this.props.onClick == null) {
                return;
            }

            if (this.doing)
                return;

            if (this.props.confirm) {
                this.showDialog();
            }
            else {
                this.execute(e);
            }
        }

        private showDialog() {
            this.dialogElement.parentElement.style.display = 'block';
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.dialogElement.style.transform = `translateY(${100}px)`, 50);
        }

        private hideDialog() {
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.dialogElement.parentElement.style.display = 'none', this.animateTime);
        }

        private execute(e) {
            let result = this.props.onClick(e) as Promise<any>;
            this.doing = true;
            if (result == null || result.catch == null || result.then == null) {
                this.doing = false;
                return;
            }

            result.then(o => {
                this.doing = false;
            }).catch(o => {
                this.doing = false;
            })

            return result;
        }

        private get doing() {
            return this._doing;
        }
        private set doing(value: boolean) {
            this._doing = value;
            if (value) {
                this.buttonElement.disabled = true;
            }
            else {
                this.buttonElement.disabled = false;
            }
        }
        private componentDidMount() {
        }

        private cancel() {
            this.hideDialog();
        }

        private ok() {
            let result = this.execute(this.currentClickEvent);
            if (result instanceof Promise) {
                result.then(() => this.hideDialog())
            }
            else {
                this.hideDialog();
            }
        }

        private renderConfirmDialog() {

        }

        render() {
            // debugger;
            let children = getChildren(this.props);
            return (
                <span>
                    <button ref={(o: HTMLButtonElement) => this.buttonElement = o || this.buttonElement}
                        onClick={(e) => this.onClick(e)} className={this.props.className}
                        style={this.props.style} disabled={this.props.disabled}>
                        {children.map(o => (o))}
                    </button>
                    <div style={{ display: 'none' }}>
                        <div ref={(o: HTMLElement) => this.dialogElement = o || this.dialogElement} className="modal"
                            style={{ display: 'block', transform: 'translateY(-10000px)', transition: `${this.animateTime / 1000}s` }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <h5 dangerouslySetInnerHTML={{ __html: this.props.confirm }}></h5>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={() => this.cancel()} className="btn btn-default">取消</button>
                                        <button type="button" onClick={() => this.ok()} className="btn btn-primary">确认</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop in"></div>
                    </div>
                </span>
            );
        }
    }
}