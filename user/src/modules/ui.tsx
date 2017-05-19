let confirmDialogElment = document.createElement('div');
confirmDialogElment.className = 'modal fade';
confirmDialogElment.style.marginTop = '20px'
document.body.appendChild(confirmDialogElment);

let toastDialogElement = document.createElement('div');
toastDialogElement.className = 'modal fade';
toastDialogElement.style.marginTop = '20px';
document.body.appendChild(toastDialogElement);

export function buttonOnClick(callback: (event: MouseEvent) => Promise<any>,
    args?: { confirm?: string, toast?: string }) {

    args = args || {};
    let execute = async (event) => {
        let button = (event.target as HTMLButtonElement);
        button.setAttribute('disabled', '');
        try {
            await callback(event);
        }
        catch (exc) {
            console.error(exc);
            throw exc;
        }
        finally {
            button.removeAttribute('disabled')
        }
    }

    return function (event) {
        let confirmPromise: Promise<any>;
        if (!args.confirm) {
            confirmPromise = Promise.resolve();
        }
        else {
            confirmPromise = new Promise((reslove, reject) => {
                ReactDOM.render(
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">&nbsp;</h4>
                            </div>
                            <div className="modal-body form-horizontal">
                                <h5>{args.confirm}</h5>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal"
                                    ref={(o: HTMLButtonElement) => {
                                        if (!o) return;
                                        o.onclick = () => {
                                            reject();
                                        }
                                    }} >取消</button>
                                <button type="button" className="btn btn-primary"
                                    ref={(o: HTMLButtonElement) => {
                                        if (!o) return;
                                        o.onclick = () => {
                                            reslove();
                                        };
                                    }}>确认</button>
                            </div>
                        </div>
                    </div>,
                    confirmDialogElment);
            });
        }

        confirmPromise.then(() => execute(event).then(() => {
            if (args.toast) {
                ReactDOM.render(
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body form-horizontal">
                                <h5>{args.toast}</h5>
                            </div>
                        </div>
                    </div>,
                    toastDialogElement);
                // $(toastDialogElement).modal();
                toastDialogElement.style.display = 'block';
                toastDialogElement.className = 'modal fade in';
                setTimeout(() => {
                    toastDialogElement.className = 'modal fade out';
                    setTimeout(() => {
                        toastDialogElement.className = 'modal fade';
                        toastDialogElement.style.removeProperty('display');
                    }, 500);
                }, 1500);
            }
        }));
    }
}