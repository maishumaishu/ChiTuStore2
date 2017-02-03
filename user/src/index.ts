
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
var services_deps = [];

if (es5) {
    chituPath = 'js/chitu.es5';
    modulesPath = 'modules.es5';
}

if (!window['fetch']) {
    services_deps.push('fetch');
}

requirejs.config({
    shim: {
        fetch: {
            exports: 'fetch'
        },
        'react-dom': {
            deps: ['react'],
            exports: window['ReactDOM'],
            init: function () {
                debugger;
            }
        },
        react: {
            exports: window['React'],
            init: function () {
                debugger;
            }
        },
        services: {
            deps: services_deps
        },
        controls: {
            deps: ['react-dom', 'react']
        },
        'controls/scrollView': {
            deps: ['hammer', 'bezier-easing']
        }
    },
    paths: {
        'bezier-easing': 'js/bezier-easing',
        chitu: chituPath,
        css: 'js/css',
        fetch: 'js/fetch',
        hammer: 'js/hammer',
        react: 'js/react',
        'react-dom': 'js/react-dom',
        redux: 'js/redux',
        text: 'js/text',
        controls: modulesPath + '/controls',
        core: modulesPath + '/core',
        device: modulesPath + '/device',
        services: modulesPath + '/services',
        site: modulesPath + '/site',
        validate:modulesPath + '/core/validate',
        'chitu.mobile': modulesPath + '/core/chitu.mobile',
        carousel: modulesPath + '/core/carousel',
        modules: modulesPath
    }
});

var modules = [
    'site',
    //'hammer', 'bezier-easing', 'controls/common', 
    // 'controls/button', 'controls/dataList', 'controls/dialog', 'controls/htmlView',
    // 'controls/imageBox', 'controls/indicators', 'controls/page', 'controls/panel',
    // 'controls/tabs'
    'controls'
];

if (isCordovaApp) {
    modules.push('cordova');
    modules.push('device');
}


if (es5) {
    requirejs(['js/polyfill'], load)
}
else {
    load();
}

function load() {
    requirejs(['react', 'react-dom'], function (React, ReactDOM) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;

        requirejs(modules, function (site, exports1) {
            controls.imageBoxConfig.imageDisaplyText = '麦子的店';
        });
    })

}



