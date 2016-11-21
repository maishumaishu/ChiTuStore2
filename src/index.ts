var es5 = true;
var modulesPath = 'modules';
var chituPath = 'js/chitu';
if (es5) {
    chituPath = 'js/chitu.es5';
    modulesPath = 'modules.es5';
}

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
        chitu: chituPath,
        css: 'js/css',
        fetch: 'js/fetch',
        hammer: 'js/hammer',
        text: 'js/text',
        move: 'js/move',
        vue: 'js/vue',
        'chitu.mobile': modulesPath + '/Core/chitu.mobile',
        'vue.ext': modulesPath + '/Core/vue.ext',
        'carousel': modulesPath + '/Core/carousel',
        'modules': modulesPath
    }
});

requirejs(['application', 'vue', 'vue.ext'], function (args, vue, vue_ext) {
    window['Vue'] = vue;
    vue_ext.config.imageBaseUrl = 'http://service.alinq.cn:2015/Shop';
});




