namespace controls {
    export function getChildren(props: React.Props<any>): Array<any> {
        props = props || {};
        let children = [];
        if (props.children instanceof Array) {
            children = props.children as Array<any>;
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }
    export function createHammerManager(element: HTMLElement): Hammer.Manager {
        let manager = new Hammer.Manager(element, { touchAction: 'auto' });
        return manager;
    }
    export class Callback<T> {
        private funcs = new Array<(args: T) => void>();
        private _value: T;

        constructor() {
        }
        add(func: (args: T) => any): (args: T) => any {
            this.funcs.push(func);
            return func;
        }
        remove(func: (args: T) => any) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(args: T) {
            this.funcs.forEach(o => o(args));
        }
    }
    export let isAndroid = navigator.userAgent.indexOf('Android') > -1;
    export let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0;
    export let isCordovaApp = location.protocol === 'file:';
    export let isWeb = location.protocol === 'http:' || location.protocol === 'https:';
}