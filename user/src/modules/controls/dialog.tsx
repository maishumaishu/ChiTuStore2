namespace controls {
    export interface DialogProps extends React.Props<Dialog> {
        footer?: JSX.Element,
        content?: string,
    }

    export interface DialogState {
        content?: string
    }

    export class Dialog extends React.Component<DialogProps, DialogState>{
        private animateTime = 400;//ms
        private element: HTMLElement;
        private dialogElement: HTMLElement;

        constructor(props) {
            super(props);

            this.state = { content: this.props.content };
        }

        get content() {
            return this.state.content;
        }
        set content(value) {
            this.state.content = value;
            this.setState(this.state);
        }

        show() {
            this.element.style.display = 'block';
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.dialogElement.style.transform = `translateY(${100}px)`, 50);
        }

        hide() {
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.element.style.display = 'none', this.animateTime);
        }

        componentDidMount() {
            this.dialogElement.style.transition = `${this.animateTime / 1000}s`;
        }
        render() {
            return (
                <div ref={(o: HTMLElement) => this.element = o} style={{ display: 'none' }}>
                    <div ref={(o: HTMLElement) => this.dialogElement = o} className="modal" style={{ display: 'block', transform: 'translateY(-10000px)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <h5 dangerouslySetInnerHTML={{ __html: this.state.content }}></h5>
                                </div>
                                {(this.props.footer ?
                                    <div className="modal-footer">
                                        {this.props.footer}
                                    </div> : null)}
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop in"></div>
                </div>
            );
        }
    }

    interface ConfirmDialogProps extends React.Props<ConfirmDialog> {
        content?: string,
    }
    export class ConfirmDialog extends React.Component<ConfirmDialogProps, {}> {

        private cancel: () => void;
        private ok: () => void;
        private dialog: Dialog;

        constructor(props) {
            super(props);
        }

        // get content() {
        //     return this.dialog.content;
        // }
        // set content(value: string) {
        //     this.dialog.content = value;
        // }

        show() {
            this.dialog.show();
            return new Promise((reslove, reject) => {
                this.cancel = () => {
                    this.dialog.hide();
                    reject();
                }
                this.ok = () => {
                    this.dialog.hide();
                    reslove();
                }
            });
        }

        hide() {
            this.dialog.hide();
        }

        render() {
            return (
                <Dialog ref={(o) => this.dialog = o} content={this.props.content}
                    footer={
                        <div>
                            <button type="button" onClick={() => this.cancel()} className="btn btn-default">取消</button>
                            <button type="button" onClick={() => this.ok()} className="btn btn-primary">确认</button>
                        </div>
                    } />
            );
        }
    }

}