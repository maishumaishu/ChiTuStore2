
declare interface VueInstance {
    $el: HTMLElement;
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
    $set(object: Object, key: string, value: any);
}

interface VueOptions<T> {
    el?: string | HTMLElement,
    computed?: any,
    data?: T | (() => T),
    methods?: any,
    mounted?: () => void,
    watch?: any,
}

declare interface VueStatic {
    new <T>(options: VueOptions<T>): T & VueInstance;
    component<T>(name: string, options: { template: string, props?: any } & VueOptions<T>): T & VueInstance;
    set(object: Object, key: string, value: any);
    nextTick(callback: Function, context?: any);
}

declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}