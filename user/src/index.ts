
/** 是否为 APP */
var isCordovaApp = location.protocol === 'file:';
var es5 = true;

var browser = function () {
    var browser = {
        msie: false, firefox: false, opera: false, safari: false,
        chrome: false, netscape: false, appname: 'unknown',
        version: 0
    };
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
        browser[RegExp.$1] = true;
        browser.appname = RegExp.$1;
        browser.version = new Number(RegExp.$2.split('.')[0]).valueOf();
    } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari 
        browser.safari = true;
        browser.appname = 'safari';
        browser.version = new Number(RegExp.$1.split('.')[0]).valueOf();
    }

    return browser;
} ();

// 通浏览器版本设定是否使用 es5
if (isCordovaApp || browser.chrome && browser.version >= 48 || browser.safari && browser.version >= 10) {
    es5 = false;
}

var modulesPath = 'modules';
var chituPath = 'js/chitu';
var app_deps = [];

if (es5) {
    chituPath = 'js/chitu.es5';
    modulesPath = 'modules.es5';
    app_deps = ['js/polyfill']
}

if (!window['fetch']) {
    app_deps.push('fetch');
}

requirejs.config({
    shim: {
        fetch: {
            exports: 'fetch'
        },
        vue: {
            exports: 'Vue'
        },
        // vuex: {
        //     deps: ['vue']
        // },
        site: {
            deps: app_deps
        }
    },
    paths: {
        'bezier-easing': 'js/bezier-easing',
        chitu: chituPath,
        css: 'js/css',
        fetch: 'js/fetch',
        hammer: 'js/hammer',
        text: 'js/text',
        move: 'js/move',
        vue: 'js/vue',
        vuex: 'js/vuex',
        controls: modulesPath + '/controls',
        core: modulesPath + '/core',
        device: modulesPath + '/device',
        services: modulesPath + '/services',
        site: modulesPath + '/site',
        'chitu.mobile': modulesPath + '/core/chitu.mobile',
        'vue.ext': modulesPath + '/core/vue.ext',
        'carousel': modulesPath + '/core/carousel',
        'modules': modulesPath
    }
});


let modules = ['site', 'vue'];
if (isCordovaApp) {
    modules.push('cordova');
    modules.push('device');
}

requirejs(modules, function (site, vue) {
    window['Vue'] = vue;
    site.config.imageText = '零食有约';
});




