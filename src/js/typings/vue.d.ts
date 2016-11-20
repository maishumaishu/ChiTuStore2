
declare interface VueInstance {
    $el: HTMLElement;
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
    $set(object: Object, key: string, value: any)
}

declare interface VueConstructor {
    new <T>(options: { el: string | HTMLElement, data: T, methods?: any }): T & VueInstance;

}
declare let Vue: VueConstructor

declare module 'vue' {
    export = Vue;
}