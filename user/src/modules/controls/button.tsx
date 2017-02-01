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
        private confirmDialog: ConfirmDialog;

        private onClick(e: React.MouseEvent) {
            if (this.props.onClick == null) {
                return;
            }

            if (this.doing)
                return;

            if (this.props.confirm) {
                this.confirmDialog.show().then(() => this.execute(e));
            }
            else {
                this.execute(e);
            }
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
            setTimeout(() => {
                let confirmDialogElement = document.createElement('div');
                //document.body.appendChild(confirmDialogElement);
                let pageView = findPageView(this.buttonElement);
                console.assert(pageView != null);
                pageView.parentElement.appendChild(confirmDialogElement);
                ReactDOM.render(<ConfirmDialog ref={(o) => this.confirmDialog = o} content={this.props.confirm} />, confirmDialogElement);
            }, 200);
        }

        private renderConfirmDialog() {

        }

        render() {
            let children = getChildren(this.props);
            return (
                <button ref={(o: HTMLButtonElement) => this.buttonElement = o}
                    onClick={(e) => this.onClick(e)} className={this.props.className}
                    style={this.props.style} disabled={this.props.disabled}>

                    {children.map(o => (o))}

                </button>
            );
        }
    }
}