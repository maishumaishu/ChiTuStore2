import Vue = require('vue');

export let config = {
    /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
    imageBaseUrl: '',

    /** 图片显示的文字 */
    imageDisaplyText: '',
}

function processImageElement(element: HTMLImageElement) {
    var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
    var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;

    var src = element.getAttribute('src') || '';
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

    var image: HTMLImageElement = new Image();
    image.onload = function () {
        element.src = (this as HTMLImageElement).src;
    };
    image.src = getImageUrl(src);


    function getImageUrl(src) {
        // 说明：替换图片路径
        if (src.substr(0, 1) == '/') {
            src = config.imageBaseUrl + src;
        }
        return src;
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
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'whitesmoke';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 设置字体
        ctx.font = "Bold 40px Arial";
        // 设置对齐方式
        ctx.textAlign = "left";
        // 设置填充颜色
        ctx.fillStyle = "#999";
        // 设置字体内容，以及在画布上的位置
        ctx.fillText(config.imageDisaplyText, canvas.width / 2 - 75, canvas.height / 2);

        img_src = canvas.toDataURL('/png');
        localStorage.setItem(img_name, img_src);
        return img_src;
    }

}



let imageBox = {
    template: '<img v-bind:src="src"/>',
    props: ['src'],
    data: function () {
        return {
        };
    },
    mounted: function () {
        let self = this as VueInstance<any>;
        processImageElement(self.$el as HTMLImageElement);
    },
    updated: function () {
        let self = this as VueInstance<any>;
        processImageElement(self.$el as HTMLImageElement);
    }
}
Vue.component(`image-box`, imageBox);
Vue.component(`imageBox`, imageBox);
