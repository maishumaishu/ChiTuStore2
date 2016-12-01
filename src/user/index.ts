
var es5 = false;
var modulesPath = 'modules';
var chituPath = 'js/chitu';
var app_deps = [];

if (es5) {
    chituPath = 'js/chitu.es5';
    modulesPath = 'modules.es5';
    app_deps = ['js/polyfill']
}


requirejs.config({
    shim: {
        fetch: {
            exports: 'fetch'
        },
        vue: {
            exports: 'Vue'
        },
        app: {
            deps: app_deps
        }
    },
    paths: {
        chitu: chituPath,
        css: 'js/css',
        //fetch: 'js/fetch',
        hammer: 'js/hammer',
        text: 'js/text',
        move: 'js/move',
        vue: 'js/vue',
        services: modulesPath + '/Services',
        app: modulesPath + '/Application',
        Controls: modulesPath + '/Controls',
        'chitu.mobile': modulesPath + '/Core/chitu.mobile',
        'vue.ext': modulesPath + '/Core/vue.ext',
        'carousel': modulesPath + '/Core/carousel',
        'modules': modulesPath
    }
});

requirejs(['app', 'vue', 'vue.ext'], function (args, vue, vue_ext) {
    window['Vue'] = vue;
    vue_ext.config.imageDisaplyText = '零食有约';
    vue_ext.config.imageBaseUrl = 'http://service.alinq.cn:2015/Shop';
});




