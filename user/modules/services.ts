import Vue = require('vue');
import Vuex = require('vuex');

Vue.use(Vuex)

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
    //storeId: '58401d1906c02a2b8877bd13',
    userToken: '584cfabb4918e4186a77ff1e'
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
    /** ------ 测试代码 ------- */
    if (config.userToken) {
        return config.userToken;
    }
    //==========================

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

    let urlParams = '';//`storeId=${storeId()}`;
    for (let key in data) {
        urlParams = urlParams + `&${key}=${data[key]}`;
    }

    // if (url.indexOf('?') < 0)
    url = url.indexOf('?') < 0 ? url + '?' + urlParams : url + '&' + urlParams;
    // else
    //url = url + '&' + urlParams;

    let options = {
        headers,
        method: 'get',
    }
    return ajax<T>(url, options);
}

type ContentType = 'json' | 'default';

function post<T>(url: string, data?: Object) {

    console.assert(userToken() != null);
    console.assert(storeId() != null);



    data = data || {};
    let headers = {
        'application-token': config.appToken,
        'user-token': userToken(),
    };

    let contentType = 'json';
    if (contentType == 'json') {
        headers['content-type'] = 'application/json';
    }

    let body: any;
    if (contentType == 'json') {
        body = JSON.stringify(data);
    }
    else {
        let form = new FormData();
        for (let key in data) {
            form.append(key, data[key]);
        }
        body = form;
    }

    let options = {
        headers,
        body,
        method: 'post'
    }
    return ajax<T>(url, options);
}

function parseDate(value: string): Date {
    const prefix = '/Date(';
    if (value.startsWith(prefix)) {
        let star = prefix.length;
        let len = value.length - prefix.length - ')/'.length;
        let str = value.substr(star, len);
        let num = parseInt(str);
        let date = new Date(num);
        return date;
    }

    throw new Error('not implment.');

}

//========================================================================================

export function imageUrl(path: string) {
    if (path.startsWith('http://localhost')) {
        path = path.substr('http://localhost'.length);
    }
    const imageBasePath = 'http://service.alinq.cn:2800/AdminServices/Shop';
    let url: string;
    if (!path.startsWith('http')) {
        url = imageBasePath + path;
    }
    else {
        url = path;
    }
    url = url + `?application-token=${config.appToken}&storeId=${storeId()}`;
    return url;
}

export module station {
    export function url(path) {
        return `${config.service.site}${path}?storeId=${storeId()}`;
    }
    export type News = { Id: string, Title: string, ImgUrl: string, Date: string, Content: string };
    export function newsList(pageIndex: number) {
        let url = station.url('Info/GetNewsList');
        return get<News[]>(url, { pageIndex }).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    export function news(newsId: string) {
        let url = station.url('Info/GetNews');
        return get<News>(url, { newsId }).then(item => {
            item.ImgUrl = imageUrl(item.ImgUrl);
            item.Date = parseDate(item.Date).toLocaleDateString();
            return item;
        });
    }

    export function searchKeywords() {
        return get<Array<string>>(url('Home/GetSearchKeywords'));
    }

    export function historySearchWords() {
        return get<Array<string>>(url('Home/HistorySearchWords'));
    }

    export function advertItems(): Promise<{ ImgUrl: string }[]> {
        return get<{ ImgUrl: string }[]>(url('Home/GetAdvertItems')).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }
}

export module home {
    type HomeProduct = { Id: string, Name: string, ImagePath: string };
    export function url() {

    }
    export function proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = station.url('Home/GetHomeProducts');
        return get<HomeProduct[]>(url, { pageIndex }).then((products) => {
            for (let product of products) {
                product.ImagePath = imageUrl(product.ImagePath); //imageBasePath + product.ImagePath;
            }
            return products;
        });
    }
    export function brands(): Promise<any> {
        let url = config.service.shop + 'Product/GetBrands';
        return get(url);
    }

    export type Product = {
        Id: string, Arguments: Array<{ key: string, value: string }>,
        BrandId: string, BrandName: string, Fields: Array<{ key: string, value: string }>,
        GroupId: string, ImageUrl: string, ImageUrls: Array<string>,
        ProductCategoryId: string, Count: number, Name: string, IsFavored?: boolean
        CustomProperties: Array<{
            Name: string,
            Options: Array<{ Name: string, Selected: boolean, Value: string }>
        }>
    };
    export function getProduct(productId): Promise<Product> {
        let url = shop.url('Product/GetProduct');
        return get<Product>(url, { productId }).then(product => {
            product.Count = 1;
            if (!product.ImageUrls && product.ImageUrl != null)
                product.ImageUrls = (<string>product.ImageUrl).split(',').map(o => imageUrl(o));

            product.ImageUrl = product.ImageUrls[0];
            product.IsFavored = null;

            isFavored(productId).then((result) => {
                product.IsFavored = result;
            })
            return product;
        });
    }
    //=====================================================================
    // 收藏夹
    export function isFavored(productId: string) {
        return get<boolean>(shop.url('Product/IsFavored'), { productId });
    }
    export function favorProduct(productId) {
        return post(shop.url('Product/FavorProduct'), { productId });
    }
    export function unfavor(productId: string) {
        return post(shop.url('Product/UnFavorProduct'), { productId });
    }
    //=====================================================================



}

export module shop {
    export function url(path: string) {
        return `${config.service.shop}${path}?storeId=${storeId()}`;
    }
    export function productIntroduce(productId: string): Promise<string> {
        let url = shop.url('Product/GetProductIntroduce');
        return get<{ Introduce: string }>(url, { productId }).then(o => o.Introduce);
    }
    export function cateories() {
        let url = shop.url('Product/GetCategories');
        return get<{ Id: string, Name: string }[]>(url);
    }
    export type ShoppingCartItem = {
        Id: string, Amount: number, Count: number, ImageUrl: string,
        Price: number, ProductId: string, Selected: boolean, Name: string,
        IsGiven: boolean
    }
}

export module shoppingCart {
    type StateType = {
        itemsCount: number
    }

    let state: StateType = { itemsCount: 0 };
    export let store = new Vuex.Store({
        state,
        mutations: {
            setItemsCount(state: StateType, value) {
                state.itemsCount = value;
            }
        }
    })

    export type Item = ShoppingCartItem;
    type ShoppingCartItem = {
        Id: string,
        Amount: number,
        Count: number,
        ImageUrl: string,
        IsGiven: boolean,
        Name: string,
        ProductId: string,
        Remark: string,
        Score: number,
        Selected: boolean,
        Unit: number,
        Price: number,
    }

    export function addItem(productId: string, count?: number) {
        count = count || 1;
        let url = shop.url('ShoppingCart/AddItem');
        return post<ShoppingCartItem[]>(url, { productId, count }).then((result) => {
            let sum = 0;
            result.forEach(o => sum = sum + o.Count);
            store.commit('setItemsCount', sum);
        });
    }

    export function getItems() {
        let url = shop.url('ShoppingCart/GetItems');
        return get<ShoppingCartItem[]>(url, {}).then(items => {
            items.forEach(o => o.ImageUrl = imageUrl(o.ImageUrl));
            return items;
        });
    }
}