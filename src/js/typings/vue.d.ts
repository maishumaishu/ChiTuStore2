
declare interface VueInstance {
    $el: HTMLElement;
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
    $set(object: Object, key: string, value: any);
}

declare interface VueStatic {
    new <T>(options: { el: string | HTMLElement, data: T, methods?: any }): T & VueInstance;
    set(object: Object, key: string, value: any);
}
declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}