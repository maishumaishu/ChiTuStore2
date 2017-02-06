namespace controls {
    class ImageFileResizeResult {
        ImageData: string
    }

    interface FileData {
        index: number
        url: string
        data: string
        thumb: string
    }

    interface ImageFileResizeCallback {
        (urls: string[], base64: string[], thumbs: string[]): void;
    }

    interface ImageThumb {
        maxWidth: number,
        maxHeight: number
    }

    class ImageFileLoader {
        private thumb2: ImageThumb;
        fileLoad = new Callback<string>();

        constructor(fileUploadElement: HTMLInputElement) {
            fileUploadElement.onchange = async () => {
                if (!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob'])) {
                    alert('The File APIs are not fully supported in this browser.');
                    return false;
                }

                for (var i = 0; i < fileUploadElement.files.length; i++) {
                    let imageData = await this.processfile(fileUploadElement.files[i]);
                    this.fileLoad.fire(imageData);
                }
            }
        }

        private processfile(file: File): Promise<string> {

            return new Promise<string>((resolve, reject) => {
                if (!(/image/i).test(file.type)) {
                    console.log("File " + file.name + " is not an image.");
                    reject();
                }

                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = (ev: Event) => {
                    var blob = new Blob([event.target['result']]);
                    window['URL'] = window['URL'] || window['webkitURL'];
                    var blobURL = window['URL'].createObjectURL(blob);
                    var image = new Image();
                    image.src = blobURL;
                    image.onload = () => {
                        var canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);

                        let data = canvas.toDataURL("/jpeg", 0.7);
                        resolve(data);
                    }
                }
            })
        }
    }


    export class ImageFileSelector extends React.Component<React.Props<ImageFileSelector>, { images: string[] }>{
        private inputElement: HTMLInputElement;
        private imageFileLoader: ImageFileLoader;

        constructor() {
            super();
            this.state = { images: [] };
        }

        componentDidMount() {
            this.imageFileLoader = new ImageFileLoader(this.inputElement);
            this.imageFileLoader.fileLoad.add((data) => {
                this.state.images.push(data);
                this.setState(this.state);
            })
        }

        get imageDatas() {
            return this.state.images;
        }

        render() {
            return (
                <div>
                    {this.state.images.map((o, i) =>
                        <div key={i} data-bind="click:$parent.showImagePage,tap:$parent.showImagePage" className="pull-left item">
                            <img src={o} width='100%' height="100%" />
                        </div>
                    )}
                    <div className="pull-left item">
                        <input ref={(o: HTMLInputElement) => this.inputElement = o} type="file" accept="images/*" multiple />
                        <i className="icon-camera"></i>
                    </div>
                </div>
            );
        }
    }
}