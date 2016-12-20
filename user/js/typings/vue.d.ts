
declare interface VueInstance<TData, TMethods> {
    $el: HTMLElement;
    $parent: VueInstance<any,TMethods>;
    $data: TData,
    $methods: TMethods,
    $emit(eventName: string, ...args: any[]);
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
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
    new <TData, TMethods>(options: VueOptions<TData, TMethods>): TData & VueInstance<TData, TMethods>;
    component<TData, TMethods>(name: string,
        options: { template: string, props?: any } & VueOptions<TData, TMethods>): any;

    set(object: Object, key: string, value: any);
    nextTick(callback: Function, context?: any);
}

declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}