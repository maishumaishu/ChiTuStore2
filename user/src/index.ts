
/** 是否为 APP */
var isCordovaApp = location.protocol === 'file:';
/** 判断是否经 babel 转换为 es5 */
let isBabelES5 = false;
class testClass {
}
isBabelES5 = window['_classCallCheck'] != null;
/** 判断是否使用 uglify 压缩 */
let isUglify = testClass.name != 'testClass';

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
}();


var modulesPath = 'modules';
var services_deps = [];

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
        chitu: 'js/chitu',
        css: 'js/css',
        fetch: 'js/fetch',
        hammer: 'js/hammer',
        react: 'js/react',
        'react-dom': 'js/react-dom',
        text: 'js/text',
        // controls: 'controls',
        // core: modulesPath + '/core',
        // device: modulesPath + '/device',
        // services: modulesPath + '/services',
        // site: modulesPath + '/site',
        // validate: modulesPath + '/core/validate',
        'chitu.mobile': 'core/chitu.mobile',
        carousel: 'core/carousel',
        modules: modulesPath,
        // ui: 'ui'
    }
});

var modules = [
    'site'
];

if (isUglify) {
    modules.push('controls');
}
else {
    let controlsPath = 'controls'
    modules.push(
        'hammer', 'bezier-easing', `${controlsPath}/common`,
        `${controlsPath}/button`, `${controlsPath}/dataList`, `${controlsPath}/dialog`, `${controlsPath}/htmlView`,
        `${controlsPath}/imageBox`, `${controlsPath}/indicators`, `${controlsPath}/page`, `${controlsPath}/panel`,
        `${controlsPath}/tabs`
    );
}

if (isCordovaApp) {
    modules.push('cordova');
    modules.push('device');
}


if (isBabelES5) {
    requirejs(['js/polyfill'], load)
}
else {
    load();
}

function load() {
    requirejs(['react', 'react-dom'], function (React, ReactDOM) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;

        requirejs(modules, function (site) {
            site.app.run();
            controls.imageBoxConfig.imageDisaplyText = '零食觅密';
        });
    })

}



