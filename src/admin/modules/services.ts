
const SERVICE_HOST = 'http://localhost:2800/';//'service.alinq.cn:2014';///UserServices

let config = {
    appToken: '58424776034ff82470d06d3d',
    userToken: '',
    storeId: '',
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
async function ajax<T>(url: string, type: 'post' | 'get', data?: any): Promise<T> {

    url = SERVICE_HOST + url;

    data = data || {};


    var form: FormData;
    if (type == 'post') {
        new FormData();
        for (let key in data) {
            form.append(key, data[key])
        }
    }
    else {
        let urlParams = '';
        for (let key in data) {
            if (urlParams == '')
                urlParams = urlParams + '?';
            else
                urlParams = urlParams + '&';

            urlParams = urlParams + `${key}=${data[key]}`;
        }
        if (urlParams)
            url = url + urlParams;
    }

    let options = {
        headers: {
            'application-token': config.appToken,
            'user-token': config.userToken,
        },
        body: form,
        method: type
    } as FetchOptions;

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
export module user {
    // let appId = '583ea7d7426fb47071984deb';
    // let appToken = '583ea7d7426fb47071984deb';
    //let userToken = '';
    type RegisterArguments = { username: string, password: string, smsId: string };
    export function register(args: RegisterArguments) {
        return post('user/register', { user: args, });
    }
    export function sendVerifyCode(mobile: string) {
        return post('sms/sendVerifyCode', { mobile, type: 'register' });
    }

    type LoginResult = { token: string, userId: string }
    export function login(username: string, password: string) {
        return get<LoginResult>('user/login', { username, password }).then((result) => {
            config.userToken = result.token;
            config.storeId = result.userId;
        });
    }
}