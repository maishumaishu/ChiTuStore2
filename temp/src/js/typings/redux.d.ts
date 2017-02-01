declare module 'redux' {
    interface Store<T, S> {
        getState: () => T,
        dispatch: (type: S) => void,
        subscribe: (callback: Function) => void
    }
    export function createStore<T, S extends Object>(action: (value: T, type: S) => T): Store<T, S>;
}