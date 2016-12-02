
const SERVICE_HOST = 'localhost:2800/UserServices';
let config = {
    service: {
        shop: `http://${SERVICE_HOST}/Shop/`,
        site: `http://${SERVICE_HOST}/Site/`,
        member: `http://${SERVICE_HOST}/Member/`,
        weixin: `http://${SERVICE_HOST}/WeiXin/`,
        account: `http://${SERVICE_HOST}/Account/`,
    },
    appId: '583ea7d7426fb47071984deb',
    appToken: '583ea7d7426fb47071984deb'
}

function isError(data: any): Error {
    if (data.Type == 'ErrorObject') {
        if (data.Code == 'Success') {
            return null;
        }
        let err = new Error(data.Message);
        err.name = data.Code;
        return err;
    }

    let err: Error = data;
    if (err.name !== undefined && err.message !== undefined && err['stack'] !== undefined) {
        return err;
    }

    return null;
}

let error = chitu.Callbacks();
let token = '';
async function ajax<T>(url: string, type: 'get' | 'post', data?: any): Promise<T> {

    url = url + `?appId=${config.appId}&appToken=${config.appToken}`;

    data = data || {};

    var form = new FormData();
    if (type == 'post') {
        for (let key in data) {
            form.append(key, data[key])
        }
    }
    else {
        for (let key in data) {
            url = url + `&${key}=${data[key]}`;
        }
    }

    let options = {
        body: form,
        method: 'post'
    } as FetchOptions;

    let response:Response;
    try{
        response = await fetch(url, options);
    }
    catch(err){
        error.fire(this,err);
        throw err;
    }
    let responseText = response.text();
    let p: Promise<string>;
    if (typeof responseText == 'string') {
        p = new Promise<string>((reslove, reject) => {
            reslove(responseText);
        })
    }
    else {
        p = responseText as Promise<string>;
    }

    let text = await responseText;
    let textObject = JSON.parse(text);

    if (isError(textObject)) {
        error.fire(this, textObject);
        throw textObject
    }

    return textObject;
}

function get<T>(url: string, data?: any) {
    return ajax<T>(url, 'get', data);
}

function post<T>(url: string, data?: any) {
    return ajax<T>(url, 'post', data);
}

const imageBasePath = 'http://service.alinq.cn:2015/Shop';
export module home {
    type HomeProduct = { Id: string, Name: string, ImagePath: string };
    export function proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = config.service.site + 'Home/GetHomeProducts';
        return get<HomeProduct[]>(url, { pageIndex }).then((products) => {
            for (let product of products) {
                product.ImagePath = imageBasePath + product.ImagePath;
            }
            return products;
        });
    }
    export function brands(): Promise<any> {
        let url = config.service.shop + 'Product/GetBrands';
        return get(url);
    }

    type Product = {
        Id: string, Arguments: Array<{ key: string, value: string }>,
        BrandId: string, BrandName: string, Fields: Array<{ key: string, value: string }>,
        GroupId: string, ImageUrl: string, ImageUrls: Array<string>,
        ProductCategoryId: string, Count: number,
        CustomProperties: Array<{
            Name: string,
            Options: Array<{ Name: string, Selected: boolean, Value: string }>
        }>
    };
    export function getProduct(productId): Promise<Product> {
        let url = config.service.shop + 'Product/GetProduct';
        return get<Product>(url, { productId }).then(product => {
            product.Count = 1;
            if (!product.ImageUrls && product.ImageUrl != null)
                product.ImageUrls = (<string>product.ImageUrl).split(',');

            return product;
        });
    }
    export function advertItems(): Promise<any[]> {
        let url = config.service.site + 'Home/GetAdvertItems'
        return get(url);
    }
}