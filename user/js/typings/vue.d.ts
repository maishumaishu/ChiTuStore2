
declare interface VueInstance {
    $el: HTMLElement;
    $parent: VueInstance;
    $data: any,
    $methods: any,
    $emit(event: string, ...args: any[]);
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
    $on(event:string,callback:Function);
    $set(object: Object, key: string, value: any);
}

interface VueOptions<TData, TMethods> {
    el?: string | HTMLElement,
    beforeUpdate?: () => void,
    computed?: any,
    data?: TData | (() => TData),
    methods?: TMethods,
    mounted?: () => void,
    updated?: () => void,
    watch?: any,
}

declare interface VueStatic {
    new <TData, TMethods>(options: VueOptions<TData, TMethods>): TData & VueInstance;
    component<TData, TMethods>(name: string,
        options: { template: string, props?: any } & VueOptions<TData, TMethods>): any;

    set(object: Object, key: string, value: any);
    nextTick(callback: Function, context?: any);
}

declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}