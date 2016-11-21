define(["require", "exports", 'vue'], function (require, exports, Vue) {
    "use strict";
    function createVueInstance(options) {
        let vm = new Vue(options);
        return vm;
        ;
    }
    exports.createVueInstance = createVueInstance;
    exports.config = {
        imageBaseUrl: '',
        imageDisaplyText: '',
    };
    function processImageElement(element) {
        var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
        var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;
        var src = element.getAttribute('src');
        var img_width = PREVIEW_IMAGE_DEFAULT_WIDTH;
        var img_height = PREVIEW_IMAGE_DEFAULT_HEIGHT;
        var match = src.match(/_\d+_\d+/);
        if (match && match.length > 0) {
            var arr = match[0].split('_');
            img_width = new Number(arr[1]).valueOf();
            img_height = new Number(arr[2]).valueOf();
        }
        element.setAttribute('width', img_width + 'px');
        element.setAttribute('height', img_height + 'px');
        var src_replace = getPreviewImage(img_width, img_height);
        element.setAttribute('src', src_replace);
        var image = new Image();
        image['element'] = element;
        image['updateScrollView'] = match == null || match.length == 0;
        image.onload = function () {
            this['element'].setAttribute('src', this.src);
        };
        image.src = getImageUrl(src);
        function getImageUrl(src) {
            if (src.substr(0, 1) == '/') {
                src = exports.config.imageBaseUrl + src;
            }
            return src;
        }
    }
    function getPreviewImage(img_width, img_height) {
        var scale = (img_height / img_width).toFixed(2);
        var img_name = 'img_log' + scale;
        var img_src = localStorage.getItem(img_name);
        if (img_src)
            return img_src;
        var MAX_WIDTH = 320;
        var width = MAX_WIDTH;
        var height = width * new Number(scale).valueOf();
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'whitesmoke';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "Bold 40px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "#999";
        ctx.fillText(exports.config.imageDisaplyText, canvas.width / 2 - 75, canvas.height / 2);
        img_src = canvas.toDataURL('/png');
        localStorage.setItem(img_name, img_src);
        return img_src;
    }
    Vue.component(`cv-img`, {
        template: '<img v-bind:src="src"/>',
        props: ['src'],
        data: function () {
            return {};
        },
        mounted: function () {
            let self = this;
            processImageElement(self.$el);
        }
    });
});
