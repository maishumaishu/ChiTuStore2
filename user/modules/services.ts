
const SERVICE_HOST = 'service.alinq.cn:2800/UserServices';
let config = {
    service: {
        shop: `http://${SERVICE_HOST}/Shop/`,
        site: `http://${SERVICE_HOST}/Site/`,
        member: `http://${SERVICE_HOST}/Member/`,
        weixin: `http://${SERVICE_HOST}/WeiXin/`,
        account: `http://${SERVICE_HOST}/Account/`,
    },
    appToken: '58424776034ff82470d06d3d',
    storeId: '58401d1906c02a2b8877bd13'
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

function userToken(value?: string) {
    if (value !== undefined) {
        localStorage.setItem('userToken', value);
        return;
    }
    return localStorage.getItem('userToken');
}

function storeId() {
    return '58401d1906c02a2b8877bd13';
}

async function ajax<T>(url: string, options: FetchOptions): Promise<T> {
    let user_token = userToken();
    if (user_token) {
        options.headers['user-token'] = user_token;
    }

    try {

        let response = await fetch(url, options);
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

        if (isError(textObject))
            throw textObject

        return textObject;
    }
    catch (err) {
        error.fire(this, err);
        throw err;
    }
}

function get<T>(url: string, data?: any) {

    // console.assert(userToken() != null);
    console.assert(storeId() != null);

    data = data || {};
    let headers = {
        'application-token': config.appToken,
    };

    if (userToken()) {
        headers['user-token'] = userToken();
    }

    let urlParams = `storeId=${storeId()}`;
    for (let key in data) {
        urlParams = urlParams + `&${key}=${data[key]}`;
    }

    url = url + '?' + urlParams;
    let options = {
        headers,
        method: 'get',
    }
    return ajax<T>(url, options);
}

type ContentType = 'json' | 'urlencoded';
function post<T>(url: string, contentType: ContentType, data?: any) {

    console.assert(userToken() != null);
    console.assert(storeId() != null);

    data = data || {};
    let headers = {
        'application-token': config.appToken,
        'user-token': userToken(),
        'content-type': 'application/json'
    };

    let body: string = '';
    if (contentType == 'json') {
        body = JSON.stringify(data);
    }
    else {
        for (let key in data) {
            if (body != '')
                body = body + '&';

            body = body + `${key}=${data[key]}`;
        }
    }

    let options = {
        headers,
        body,
        method: 'post'
    }
    return ajax<T>(url, options);
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