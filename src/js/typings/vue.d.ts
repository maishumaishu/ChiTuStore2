// declare cl Vue(options: {
//     el: string,
//     data: any
// });

declare class Vue {
    constructor(options: { el: string | HTMLElement, data: any, methods?: any });
    $el: HTMLElement;
}

declare module 'vue' {
    export = Vue;
}