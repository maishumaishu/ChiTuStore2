import Vue = require('vue');
import Vuex = require('vuex');
import chitu = require('chitu');
Vue.use(Vuex)


export class AjaxError implements Error {
    name: string;
    message: string;
    method: 'get' | 'post';

    constructor(method) {
        this.name = 'ajaxError';
        this.message = 'Ajax Error';
        this.method = method;
    }
}

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
    userToken: '584cfabb4918e4186a77ff1e',
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 20,
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

//========================================================================================

let state = { itemsCount: 0 };
let store = new Vuex.Store({
    state,
    mutations: {
        setItemsCount(context, value) {
            state.itemsCount = value;
        }
    }
})
function storeCommit(name: 'setItemsCount', value) {
    store.commit(name, value);
}
//========================================================================================

function serviceUrl(baseUrl, path) {
    return `${baseUrl}${path}?storeId=${storeId()}`;;
}

export type News = { Id: string, Title: string, ImgUrl: string, Date: string, Content: string };

export abstract class Service {
    error = chitu.Callbacks<Service, Error>();
    ajax<T>(url: string, options: FetchOptions): Promise<T> {
        return new Promise<T>((reslove, reject) => {
            let timeId = setTimeout(() => {
                let err = new AjaxError(options.method);
                err.name = 'timeout';
                reject(err);
                this.error.fire(this, err);
                clearTimeout(timeId);

            }, config.ajaxTimeout * 1000)

            this._ajax<T>(url, options)
                .then(data => {
                    reslove(data);
                    clearTimeout(timeId);
                })
                .catch(err => {
                    reject(err);
                    this.error.fire(this, err);
                    clearTimeout(timeId);
                });

        })
    }

    private async _ajax<T>(url: string, options: FetchOptions): Promise<T> {
        let user_token = userToken();
        if (user_token) {
            options.headers['user-token'] = user_token;
        }

        try {
            let response = await fetch(url, options);
            if (response.status >= 300) {
                let err = new AjaxError(options.method);
                err.name = `${response.status}`;
                err.message = response.statusText;
                throw err
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
            let err = isError(textObject);
            if (err)
                throw err;

            return textObject;
        }
        catch (err) {
            this.error.fire(this, err);
            throw err;
        }
    }

    get<T>(url: string, data?: any) {

        console.assert(storeId() != null);

        data = data || {};
        let headers = {
            'application-token': config.appToken,
        };

        if (userToken()) {
            headers['user-token'] = userToken();
        }

        let urlParams = '';
        for (let key in data) {
            urlParams = urlParams + `&${key}=${data[key]}`;
        }

        if (urlParams)
            url = url.indexOf('?') < 0 ? url + '?' + urlParams : url + '&' + urlParams;

        let options = {
            headers,
            method: 'get',
        }
        return this.ajax<T>(url, options);
    }

    post<T>(url: string, data?: Object) {

        console.assert(userToken() != null);
        console.assert(storeId() != null);

        data = data || {};
        let headers = {
            'application-token': config.appToken,
            'user-token': userToken(),
        };

        headers['content-type'] = 'application/json';

        let body: any;
        body = JSON.stringify(data);
        let options = {
            headers,
            body,
            method: 'post'
        }
        return this.ajax<T>(url, options);
    }
}

export class StationService extends Service {
    constructor() {
        super();
    }

    static url(path) {
        return `${config.service.site}${path}?storeId=${storeId()}`;
    }

    newsList(pageIndex: number) {
        let url = StationService.url('Info/GetNewsList');
        return this.get<News[]>(url, { pageIndex }).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    news(newsId: string) {
        let url = StationService.url('Info/GetNews');
        return this.get<News>(url, { newsId }).then(item => {
            item.ImgUrl = imageUrl(item.ImgUrl);
            item.Date = parseDate(item.Date).toLocaleDateString();
            return item;
        });
    }

    searchKeywords() {
        return this.get<Array<string>>(StationService.url('Home/GetSearchKeywords'));
    }

    historySearchWords() {
        return this.get<Array<string>>(StationService.url('Home/HistorySearchWords'));
    }

    advertItems(): Promise<{ ImgUrl: string }[]> {
        return this.get<{ ImgUrl: string }[]>(StationService.url('Home/GetAdvertItems')).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = StationService.url('Home/GetHomeProducts');
        return this.get<HomeProduct[]>(url, { pageIndex }).then((products) => {
            for (let product of products) {
                product.ImagePath = imageUrl(product.ImagePath);
            }
            return products;
        });
    }
}

interface DataSourceSelectResult<T> {
    DataItems: T[],
    MaximumRows?: number,
    StartRowIndex?: number,
    TotalRowCount: number
}

type HomeProduct = { Id: string, Name: string, ImagePath: string };
type Product = {
    Id: string, Arguments: Array<{ key: string, value: string }>,
    BrandId: string, BrandName: string, Fields: Array<{ key: string, value: string }>,
    GroupId: string, ImageUrl: string, ImageUrls: Array<string>,
    ProductCategoryId: string, Count: number, Name: string, IsFavored?: boolean,
    ProductCategoryName: string,
    CustomProperties: Array<{
        Name: string,
        Options: Array<{ Name: string, Selected: boolean, Value: string }>
    }>
};
export type FavorProduct = {
    ProductId: string,
    ProductName: string,
    ImageUrl: string
}
export class ShopService extends Service {
    constructor() {
        super();
    }
    static url(path: string) {
        return `${config.service.shop}${path}?storeId=${storeId()}`;
    }
    product(productId): Promise<Product> {
        let url = ShopService.url('Product/GetProduct');
        return this.get<Product>(url, { productId }).then(product => {
            product.Count = 1;
            if (!product.ImageUrls && product.ImageUrl != null)
                product.ImageUrls = (<string>product.ImageUrl).split(',').map(o => imageUrl(o));

            product.ImageUrl = product.ImageUrls[0];
            product.IsFavored = null;

            this.isFavored(productId).then((result) => {
                product.IsFavored = result;
            })
            return product;
        });
    }
    productIntroduce(productId: string): Promise<string> {
        let url = ShopService.url('Product/GetProductIntroduce');
        return this.get<{ Introduce: string }>(url, { productId }).then(o => o.Introduce);
    }
    products(categoryId: string, pageIndex: number) {
        let url = ShopService.url('Product/GetProducts');
        return this.get<{ Products: Array<Product> }>(url, {
            filter: `ProductCategoryId=Guid.Parse('${categoryId}')`,
            startRowIndex: pageIndex * 20
        }).then(o => {
            o.Products.forEach(o => {
                o.ImageUrl = imageUrl(o.ImageUrl);
            });
            return o.Products;
        });
    }
    cateories() {
        let url = ShopService.url('Product/GetCategories');
        return this.get<{ Id: string, Name: string }[]>(url);
    }
    //=====================================================================
    // 收藏夹
    favorProducts() {
        return this.get<FavorProduct[]>(ShopService.url('Product/GetFavorProducts')).then(items => {
            items.forEach(o => o.ImageUrl = imageUrl(o.ImageUrl))
            return items;
        });
    }
    unfavorProduct(productId: string) {
        return this.post(ShopService.url('Product/UnFavorProduct'), { productId });
    }
    isFavored(productId: string) {
        return this.get<boolean>(ShopService.url('Product/IsFavored'), { productId });
    }
    favorProduct(productId) {
        return this.post(ShopService.url('Product/FavorProduct'), { productId });
    }
    //=====================================================================
}

export type ShoppingCartItem = {
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

export class ShoppingCartService extends Service {
    constructor() {
        super();
        let _userToken = userToken();
        if (_userToken) {
            this.get<number>(this.url('ShoppingCart/GetProductsCount')).then(result => {
                storeCommit('setItemsCount', result);
            })
        }
    }
    private url(path: string) {
        return `${config.service.shop}${path}?storeId=${storeId()}`;
    }

    addItem(productId: string, count?: number) {
        count = count || 1;
        return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/AddItem'), { productId, count }).then((result) => {
            let sum = 0;
            result.forEach(o => sum = sum + o.Count);
            store.commit('setItemsCount', sum);
        });
    }

    items() {
        return this.get<ShoppingCartItem[]>(this.url('ShoppingCart/GetItems')).then(items => {
            items.forEach(o => o.ImageUrl = imageUrl(o.ImageUrl));
            return items;
        });
    }

    productsCount(): number {
        return store.state.itemsCount;
    }
}

type UserInfo1 = {
    Id: string,
    Email: string,
    Mobile: string,
    OpenId: string,
    PasswordSetted: boolean,
    PaymentPasswordSetted: boolean,
    UserName: string,
    HeadImageUrl: string,
}

type UserInfo2 = {
    Balance: number,
    NotPaidCount: number,
    Score: number,
    SendCount: number,
    ShoppingCartItemsCount: number,
    NickName: string,
    ToEvaluateCount: number,
}

export class MemberService extends Service {
    constructor() {
        super();
    }

    private url(path: string) {
        return `${config.service.member}${path}?storeId=${storeId()}`;
    }

    userInfo() {
        let url1 = this.url('Member/GetMember');
        let url2 = serviceUrl(config.service.shop, 'User/GetUserInfo');
        return Promise.all([this.get<UserInfo1>(url1), this.get<UserInfo2>(url2)]).then(result => {
            let userInfo = Object.assign(result[0], result[1]);
            return userInfo;
        });
    }

}

