import * as chitu from 'chitu';

const SERVICE_HOST = 'http://service.alinq.cn:2800/';//'http://localhost:2800/';//

let config = {
    appToken: '58424776034ff82470d06d3d'
}

function userToken(value?: string) {
    if (value !== undefined) {
        localStorage.setItem('userToken', value);
        return;
    }
    return localStorage.getItem('userToken');
}

function storeId(value?: string) {
    if (value !== undefined) {
        localStorage.setItem('storeId', value);
        return;
    }
    return localStorage.getItem('storeId');
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

export let error = chitu.Callbacks();
let token = '';

async function ajax<T>(url: string, options: FetchOptions): Promise<T> {
    //type: 'post' | 'get', contentType: ContentType, data?: any
    url = SERVICE_HOST + url;

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

    console.assert(userToken() != null);
    console.assert(storeId() != null);

    data = data || {};
    let headers = {
        'application-token': config.appToken,
        'user-token': userToken(),
    };

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

    let options = {
        headers,
        body: JSON.stringify(data),
        method: 'post'
    }
    return ajax<T>(url, options);
}

const imageBasePath = 'http://service.alinq.cn:2015/Shop';
export interface RegisterModel {
    user: { mobile: string, password: string },
    smsId: string,
    verifyCode: string
}
export module user {
    export function register(model: RegisterModel) {
        let options = {
            headers: {
                'application-token': config.appToken,
                'content-type': 'application/json'
            },
            body: JSON.stringify(model),
            method: 'post'
        }
        return ajax<{ token: string, userId: string }>('user/register', options).then(result => {
            userToken(result.token);
            storeId(result.userId);

            return result;
        });
    }
    export function sendVerifyCode(mobile: string): Promise<{ smsId: string }> {
        let options = {
            headers: {
                'application-token': config.appToken,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ mobile, type: 'register' }),
            method: 'put'
        }
        return ajax('sms/sendVerifyCode', options);
    }

    type LoginResult = { token: string, userId: string }
    export function login(username: string, password: string) {
        let options = {
            headers: {
                'application-token': config.appToken,
            },
            method: 'get'
        }
        let url = `user/login?username=${username}&password=${password}`;
        return ajax<LoginResult>(url, options).then((result) => {
            userToken(result.token);
            storeId(result.userId);
        });
    }
}

interface DataSourceSelectResult<T> {
    DataItems: T[],
    MaximumRows?: number,
    StartRowIndex?: number,
    TotalRowCount: number
}

export module shop {
    type ProductsResult = DataSourceSelectResult<{
        Id: string, Name: string, Price: string,
        Unit: string, ImagePath: string, ImageUrl: string
    }>;
    interface DataSourceSelectArguments {
        startRowIndex?: number,
        maximumRows?: number,
        filter?: string
    }
    export function products(type: 'onShelve' | 'offShelve' | 'all', pageIndex: number) {
        console.assert(pageIndex >= 0);

        let url = 'AdminServices/Shop/Product/GetProducts';
        //let filter = 'true';


        const PAGE_SIZE = 20;
        let args: DataSourceSelectArguments = {
            startRowIndex: PAGE_SIZE * pageIndex,
            maximumRows: PAGE_SIZE,
        };

        if (type == 'onShelve')
            args.filter = 'OffShelve != true'
        else if (type == 'offShelve')
            args.filter = 'OffShelve = true';

        return get<ProductsResult>(url, args)
            .then(o => {
                o.DataItems.forEach(c => {
                    c.ImageUrl = (c.ImagePath || '').split(',')[0];
                });
                return { dataItems: o.DataItems, loadComplete: o.DataItems.length < PAGE_SIZE };
            });
    }
    export function orders() {
        let args = {
            startRowIndex: 0,
            maximumRows: 20
        }

        let url = 'AdminServices/Shop/Order/GetOrders';
        return get<DataSourceSelectResult<any>>(url, args).then(o => o.DataItems);
    }
}

// userToken('584ae360ec3a7324d0e4c249');
// storeId('584ae35fec3a7324d0e4c248');
