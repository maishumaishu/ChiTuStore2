// import fetch = require('fetch');

const SERVICE_HOST = 'localhost:2014/UserServices';//'service.alinq.cn:2014';///UserServices
let config = {
    service: {
        shop: `http://${SERVICE_HOST}/Shop/`,
        site: `http://${SERVICE_HOST}/Site/`,
        member: `http://${SERVICE_HOST}/Member/`,
        weixin: `http://${SERVICE_HOST}/WeiXin/`,
        account: `http://${SERVICE_HOST}/Account/`,
    },
    appToken: '7F0B6740588DCFA7E1C29C627B8C87379F1C98D5962FAB01D0D604307C04BFF0182BAE0B98307143'
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

let token = '';
export function ajax<T>(url: string, data?: any): Promise<T> {
    data = data || {};
    Object.assign(data, { AppToken: config.appToken });

    var form = new FormData();
    for (let key in data) {
        form.append(key, data[key])
    }

    let options = {
        //headers: { appToken: config.appToken, token },
        // headers: {
        //     'Application-Id': '582529cc404c42150fe6aec4',
        //     'Application-Token': '582529cc404c42150fe6aec4'
        // },
        body: form,
        method: 'post'
    } as FetchOptions;

url = url + '?appId=582529cc404c42150fe6aec4&appToken=582529cc404c42150fe6aec4'

    return fetch(url, options).then((response) => {
        let text = response.text();
        let p: Promise<string>;
        if (typeof text == 'string') {
            p = new Promise<string>((reslove, reject) => {
                reslove(text);
            })
        }
        else {
            p = text as Promise<string>;
        }

        return p.then((text) => {
            return new Promise((resolve, reject) => {
                let data = JSON.parse(text);
                let err = isError(data);
<<<<<<< HEAD:src/admin/modules/Services.ts
                if (!err) {
                    resolve(data);
                    return;
                }

                reject(err);
                return;
=======
                if (err)
                    reject(err);
                else
                    resolve(data);
>>>>>>> 6e15e0b0c3d9d7294a607eb2c9627bc0eeddbbcc:src/modules/Services.ts
            });
        })
    });
}

const imageBasePath = 'http://service.alinq.cn:2015/Shop';
export module home {
    type HomeProduct = { Id: string, Name: string, ImagePath: string };
    export function proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = config.service.site + 'Home/GetHomeProducts';
        return ajax<HomeProduct[]>(url, { pageIndex }).then((products) => {
            for (let product of products) {
                product.ImagePath = imageBasePath + product.ImagePath;
            }
            return products;
        });
    }
    export function brands(): Promise<any> {
        let url = config.service.shop + 'Product/GetBrands';
        return ajax(url);
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
        return ajax<Product>(url, { productId }).then(product => {
            product.Count = 1;
            if (!product.ImageUrls && product.ImageUrl != null)
                product.ImageUrls = (<string>product.ImageUrl).split(',');

            return product;
        });
    }
    export function advertItems(): Promise<any[]> {
        let url = config.service.site + 'Home/GetAdvertItems'
        return ajax(url);
    }
}