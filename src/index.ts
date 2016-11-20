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
        hammer: 'js/hammer',
        text: 'js/text',
        move: 'js/move',
        vue: 'js/vue',
    }
});

requirejs(['application', 'vue', 'core/vue.ext'], function (args, vue, vue_ext) {
    window['Vue'] = vue;
    vue_ext.config.imageBaseUrl = 'http://service.alinq.cn:2015/Shop';
});




