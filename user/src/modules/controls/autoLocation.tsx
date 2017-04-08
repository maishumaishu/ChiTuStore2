export default class AutoLocation {
    constructor() {

    }
    init() {
        return new Promise<any>((resolve, reject) => {
            var location = {};
            if (!navigator.geolocation) {
                reject({ text: "Your browser does not support Geolocation!", status: false });
                return;
            }
            // {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.locationSuccess(resolve, reject, position);
                },
                (error) => {
                    this.locationError(reject, error)
                },
                {
                    // 指示浏览器获取高精度的位置，默认为false
                    enableHighAccuracy: true,
                    // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                    timeout: 10000,
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                    maximumAge: 0
                });
        });
    }
    locationError(reject, error) {
        reject({ text: "fail!", status: false });
        // switch (error.code) {
        //     case error.TIMEOUT:
        //         location = { text: "A timeout occured! Please try again!", status: false };
        //         break;
        //     case error.POSITION_UNAVAILABLE:
        //         location = { text: "We can\'t detect your location. Sorry!", status: false };
        //         break;
        //     case error.PERMISSION_DENIED:
        //         location = { text: "Please allow geolocation access for this to work!", status: false };
        //         break;
        //     case error.UNKNOWN_ERROR:
        //         location = { text: "An unknown error occured!", status: false };
        //         break;
        // }
        // return location;
    }
    locationSuccess(resolve, reject, position) {
        let AMap = "http://webapi.amap.com/maps?v=1.3&key=739831be4da5a88706d6dfaaf2da62d7";
        requirejs([AMap], () => {
            var mapObj = new window['AMap'].Map('iCenter');
            var geocoder;
            var lnglatXY = new window['AMap'].LngLat(position.coords.longitude, position.coords.latitude);
            //加载地理编码插件 
            mapObj.plugin(["AMap.Geocoder"], () => {
                geocoder = new window['AMap'].Geocoder({
                    radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息 
                    batch: false,
                    extensions: "all"//返回地址描述以及附近兴趣点和道路信息，默认"base" 
                });
                //逆地理编码 
                geocoder.getAddress(lnglatXY, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        resolve({ text: result, status: true });
                    } else {
                        reject({ text: "", status: false });
                    }
                });
            });
        });
    }
}

export interface LocationObj {
    status: Boolean,
    text: String
}
