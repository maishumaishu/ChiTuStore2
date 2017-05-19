namespace controls {
    export let imageBoxConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',

        /** 图片显示的文字 */
        imageDisaplyText: '',
    }

    let config = imageBoxConfig;

    /** 加载图片到 HTMLImageElement */
    export function loadImage(element: HTMLImageElement, imageUrl: string, imageText?: string): Promise<string> {
        // imageText = imageText || config.imageDisaplyText;
        var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
        var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;

        let src = imageUrl;
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

        function getPreviewImage(imageText: string, img_width: number, img_height: number) {

            var scale = (img_height / img_width).toFixed(2);
            var img_name = 'img_log' + scale;

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
            ctx.fillText(imageText, canvas.width / 2 - 75, canvas.height / 2);

            var img_src = canvas.toDataURL('/png');
            // localStorage.setItem(img_name, img_src);
            return img_src;
        }

        //设置默认的图片
        var src_replace = getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);

        return new Promise((resolve, reject) => {
            var image: HTMLImageElement = new Image();
            image.onload = function () {
                element.src = (this as HTMLImageElement).src;
                resolve(element.src);
            };
            image.src = src;
        })


    }


    export class ImageBox extends React.Component<
        React.Props<ImageBox> & {
            src: string, className?: string, style?: React.CSSProperties,
            text?: string, onChange?: (base64Data: string) => void
        },
        { src: string }> {

        private unmount = false;

        constructor(props) {
            super(props);
            this.state = { src: this.props.src };
        }

        componentWillUnmount() {
            this.unmount = true;
        }

        render() {
            return (
                <img className={this.props.className} style={this.props.style}
                    ref={(o: HTMLImageElement) => {
                        if (!o) return;
                        loadImage(o, this.state.src || '', this.props.text || config.imageDisaplyText)
                            .then(data => {
                                if (!this.props.onChange) return;
                                this.props.onChange(data);
                            });
                    }} ></img>
            );
        }
    }

}