const SERVICE_HOST = 'localhost:2014/UserServices';//'service.alinq.cn:2014';///UserServices
let config = {
    service: {
        shop: `http://${SERVICE_HOST}/Shop/`,
        site: `http://${SERVICE_HOST}/Site/`,
        member: `http://${SERVICE_HOST}/Member/`,
        weixin: `http://${SERVICE_HOST}/WeiXin/`,
        account: `http://${SERVICE_HOST}/Account/`,
    },
    appId: '582529cc404c42150fe6aec4',
    appToken: '582529cc404c42150fe6aec4'
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
    data = Object.assign(data, {
        appId: config.appId,
        appToken: config.appToken
    }, data || {});

    var form = new FormData();
    for (let key in data) {
        form.append(key, data[key])
    }

    let options = {
        body: form,
        method: 'post'
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
    let appId = '583ea7d7426fb47071984deb';
    let appToken = '583ea7d7426fb47071984deb';
    type RegisterArguments = { username: string, password: string, smsId: string };
    export function register(args: RegisterArguments) {
        return post('user/register', { appId, appToken, user: args, });
    }
    export function sendVerifyCode(mobile: string) {
        return post('sms/sendVerifyCode', { appId, appToken, mobile, type: 'register' });
    }
}