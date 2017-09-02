var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ui;
(function (ui) {
    ui.dialogContainer = document.body;
    function setDialogContainer(value) {
        if (value == null)
            throw new Error('value can not be null.');
        ui.dialogContainer = value;
    }
    ui.setDialogContainer = setDialogContainer;
    function buttonOnClick(callback, args) {
        args = args || {};
        let execute = (event) => __awaiter(this, void 0, void 0, function* () {
            let button = event.target;
            button.setAttribute('disabled', '');
            try {
                yield callback(event);
                if (args.toast) {
                    showToastMessage(args.toast);
                }
            }
            catch (exc) {
                console.error(exc);
                throw exc;
            }
            finally {
                button.removeAttribute('disabled');
            }
        });
        return function (event) {
            let confirmPromise;
            let confirmDialogElment;
            if (!args.confirm) {
                execute(event);
                return;
            }
            confirmDialogElment = document.createElement('div');
            confirmDialogElment.className = 'modal fade';
            confirmDialogElment.style.marginTop = '20px';
            console.assert(ui.dialogContainer != null, 'dialog container is null');
            ui.dialogContainer.appendChild(confirmDialogElment);
            confirmDialogElment.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                    </button>
                                    <h4 class="modal-title">确认</h4>
                                </div>
                                <div class="modal-body form-horizontal">
                                   
                                </div>
                                <div class="modal-footer">
                                    <button name="cancel" type="button" class="btn btn-default">
                                        取消
                                    </button>
                                    <button name="ok" type="button" class="btn btn-primary">
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
            let modalHeader = confirmDialogElment.querySelector('.modal-header');
            let modalBody = confirmDialogElment.querySelector('.modal-body');
            let modalFooter = confirmDialogElment.querySelector('.modal-footer');
            modalBody.innerHTML = `<h5>${args.confirm}</h5>`;
            let cancelButton = modalFooter.querySelector('[name="cancel"]');
            let okButton = modalFooter.querySelector('[name="ok"]');
            let closeButton = modalHeader.querySelector('.close');
            closeButton.onclick = cancelButton.onclick = function () {
                ui.hideDialog(confirmDialogElment).then(() => {
                    confirmDialogElment.remove();
                });
            };
            okButton.onclick = function () {
                execute(event)
                    .then(() => ui.hideDialog(confirmDialogElment))
                    .then(() => {
                    confirmDialogElment.remove();
                });
            };
            ui.showDialog(confirmDialogElment);
        };
    }
    ui.buttonOnClick = buttonOnClick;
    function showToastMessage(msg) {
        if (!msg)
            throw new Error('Argument msg is null.');
        let toastDialogElement = document.createElement('div');
        toastDialogElement.className = 'modal fade in';
        toastDialogElement.style.marginTop = '20px';
        console.assert(ui.dialogContainer != null, 'dialog container is null.');
        ui.dialogContainer.appendChild(toastDialogElement);
        toastDialogElement.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body form-horizontal">
                                </div>
                            </div>
                        </div>
                    `;
        let modalBody = toastDialogElement.querySelector('.modal-body');
        console.assert(modalBody != null);
        if (typeof msg == 'string')
            modalBody.innerHTML = `<h5>${msg}</h5>`;
        else
            modalBody.appendChild(msg);
        let dialog = new ui.Dialog(toastDialogElement);
        dialog.show();
        setTimeout(() => {
            dialog.hide().then(() => {
                toastDialogElement.remove();
                dialog = null;
            });
        }, 500);
    }
})(ui || (ui = {}));
var ui;
(function (ui) {
    class Dialog {
        constructor(element) {
            this.element = element;
        }
        show() {
            this.element.style.display = 'block';
            this.element.className = 'modal fade in';
        }
        hide() {
            this.element.className = 'modal fade out';
            this.element.style.removeProperty('display');
            return new Promise((reslove, reject) => {
                setTimeout(() => {
                    reslove();
                }, 1000);
            });
        }
    }
    ui.Dialog = Dialog;
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    function showDialog(element) {
        element.style.display = 'block';
        element.className = 'modal fade in';
        let closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].onclick = () => hideDialog(element);
        }
    }
    ui.showDialog = showDialog;
    function hideDialog(element) {
        element.className = 'modal fade out';
        element.style.removeProperty('display');
        return new Promise((reslove, reject) => {
            setTimeout(() => {
                reslove();
            }, 1000);
        });
    }
    ui.hideDialog = hideDialog;
    function alert(args) {
        let element = document.createElement('div');
        ui.dialogContainer.appendChild(element);
        if (typeof args == 'string') {
            args = { title: '&nbsp;', message: args };
        }
        element.innerHTML = `
            <div class="modal-dialog">
                
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title">${args.title}</h4>
                    </div>
                    <div class="modal-body">
                        <h5>${args.message}</h5>
                    </div>
                    <div class="modal-footer">
                        <button name="ok" type="button" class="btn btn-primary">
                            确定
                        </button>
                    </div>
                </div>
            </div>
        `;
        // $(element).modal();
        // $(element).on('hidden.bs.modal', () => {
        //     $(element).remove();
        // });
        var dialog = new Dialog(element);
        dialog.show();
        let titleElement = element.querySelector('.modal-title');
        let modalFooter = element.querySelector('.modal-footer');
        let cancelButton = modalFooter.querySelector('[name="cancel"]');
        let okButton = modalFooter.querySelector('[name="ok"]');
        okButton.onclick = () => dialog.hide();
    }
    ui.alert = alert;
})(ui || (ui = {}));
var ui;
(function (ui) {
    ui.loadImageConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',
        /** 图片显示的文字 */
        imageDisaplyText: '',
    };
    let config = ui.loadImageConfig;
    function loadImage(element) {
        // imageText = imageText || config.imageDisaplyText;
        //, imageUrl: string, imageText?: string
        let imageUrl = element.src || '';
        let imageText = element.title || '';
        var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
        var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;
        let src = imageUrl;
        var img_width = PREVIEW_IMAGE_DEFAULT_WIDTH;
        var img_height = PREVIEW_IMAGE_DEFAULT_HEIGHT;
        var match = src.match(/_\d+_\d+/);
        if (match && match.length > 0) {
            var arr = match[0].split('_');
            img_width = new Number(arr[1]).valueOf();
            img_height = new Number(arr[2]).valueOf();
        }
        // element.setAttribute('width', img_width + 'px');
        // element.setAttribute('height', img_height + 'px');
        function getPreviewImage(imageText, img_width, img_height) {
            var scale = (img_height / img_width).toFixed(2);
            var img_name = 'img_log' + scale;
            var MAX_WIDTH = 320;
            var width = MAX_WIDTH;
            var height = width * new Number(scale).valueOf();
            var canvas = document.createElement('canvas');
            canvas.width = width; //img_width;
            canvas.height = height; //img_height;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'whitesmoke';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 设置字体
            ctx.font = "Bold 40px Arial";
            // 设置对齐方式
            ctx.textAlign = "left";
            // 设置填充颜色
            ctx.fillStyle = "#999";
            // 设置字体内容，以及在画布上的位置
            ctx.fillText(imageText, canvas.width / 2 - 75, canvas.height / 2);
            var img_src = canvas.toDataURL('/png');
            // localStorage.setItem(img_name, img_src);
            return img_src;
        }
        //设置默认的图片
        var src_replace = getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = function () {
                element.src = this.src;
                resolve(element.src);
            };
            image.src = src;
        });
    }
    ui.loadImage = loadImage;
})(ui || (ui = {}));
