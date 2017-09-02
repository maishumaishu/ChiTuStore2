declare namespace ui {
    type Callback = (event: MouseEvent) => Promise<any>;
    type Arguments = {
        confirm?: string;
        toast?: string | HTMLElement;
    };
    let dialogContainer: HTMLElement;
    function setDialogContainer(value: HTMLElement): void;
    function buttonOnClick(callback: Callback, args?: Arguments): (event: Event) => void;
}
declare namespace ui {
    class Dialog {
        private element;
        constructor(element: HTMLElement);
        show(): void;
        hide(): Promise<any>;
    }
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    function showDialog(element: HTMLElement): void;
    function hideDialog(element: HTMLElement): Promise<{}>;
    function alert(args: string | {
        title: string;
        message: string;
    }): void;
}
declare namespace ui {
    let loadImageConfig: {
        imageBaseUrl: string;
        imageDisaplyText: string;
    };
    function loadImage(element: HTMLImageElement): Promise<string>;
}
declare module 'ui'{
    export = ui;
}