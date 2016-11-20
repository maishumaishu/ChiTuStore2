
declare interface VueInstance {
    $el: HTMLElement;
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
    $set(object: Object, key: string, value: any);
}

interface VueOptions<T> {
    el: string | HTMLElement,
    data: T,
    methods?: any,
    mounted?: () => void,
    watch?: any,
}

declare interface VueStatic {
    new <T>(options: VueOptions<T>): T & VueInstance;
    component(name: string, options: {
        data?: any,
        mounted?: Function,
        props?: any,
        template: string,
        watch?: Function,
    });
    set(object: Object, key: string, value: any);
    nextTick(callback: Function, context?: any);
}

declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}