// declare cl Vue(options: {
//     el: string,
//     data: any
// });

declare class Vue {
    constructor(options: { el: string, data: any })
}

declare module 'vue' {
    export = Vue;
}