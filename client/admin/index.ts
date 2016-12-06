
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
        hammer: 'js/hammer',
        text: 'js/text',
        move: 'js/move',
        vue: 'js/vue',
        validate: 'js/validate',

        application: modulesPath + '/application',
        errorHandle: modulesPath + '/errorHandle',
        services: modulesPath + '/services',
        'chitu.mobile': modulesPath + '/core/chitu.mobile',
        'vue.ext': modulesPath + '/core/vue.ext',
        'carousel': modulesPath + '/core/carousel',
        'modules': modulesPath
    }
});

requirejs(['application', 'vue', 'vue.ext', 'errorHandle'], function (args, vue, vue_ext) {
    window['Vue'] = vue;
    vue_ext.config.imageDisaplyText = '零食有约';
    vue_ext.config.imageBaseUrl = 'http://service.alinq.cn:2015/Shop';
});




