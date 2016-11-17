requirejs.config({
    shim: {
        app: {
            deps: ['vue']
        },
        fetch: {
            exports: 'fetch'
        },
        vue: {
            exports: 'Vue'
        }
    },
    paths: {
        chitu: 'js/chitu',
        css: 'js/css',
        fetch: 'js/fetch',
        text: 'js/text',
        vue: 'js/vue',
    }
});

requirejs(['app']);




