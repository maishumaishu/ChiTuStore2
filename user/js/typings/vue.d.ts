
declare interface VueInstance<TData> {
    $el: HTMLElement;
    $parent: VueInstance<any>;
    $data: TData,
    $methods: any,
    $slots: any,
    $store: any,
    $emit(event: string, ...args: any[]);
    $nextTick(callback: Function);
    $on(event: string, callback: Function);
    $set(object: Object, key: string, value: any);
    $watch(expOrFn: string | Function, callback: Function, options?: { deep?: boolean, immediate?: boolean }): Function;
}

interface VueOptions<TData, TMethods> {
    el?: string | HTMLElement,
    beforeUpdate?: () => void,
    computed?: any,
    data?: TData | (() => TData),
    methods?: TMethods,
    mounted?: () => void,
    render?: (createElement: Function, context: any) => void,
    store?: Vuex.Store<any>,
    updated?: () => void,
    watch?: any,
}

declare interface VueStatic {
    new <TData, TMethods>(options: VueOptions<TData, TMethods>): TData & TMethods & VueInstance<TData>;
    component<TData, TMethods>(name: string, options: { template: string, props?: any } & VueOptions<TData, TMethods>): Function;
    set(object: Object, key: string, value: any);
    nextTick(callback: Function, context?: any);
}

declare let Vue: VueStatic

declare module 'vue' {
    export = Vue;
}

//==========================================================================
declare namespace Vuex {
    export interface VuexStoreInstance {

    }
    export class Store<StateType> {
        constructor(options: {
            state?: StateType,
            getters?: any,
            actions?: any,
            mutations?: any
        })
        state: StateType;
        commit: (name: string, value?: any) => void;
    }
    export function mapGetters(getters: Array<string>);
    export function mapActions(actions: Array<string>);
}

declare module 'vuex' {
    export = Vuex;

}
