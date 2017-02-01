
import chitu = require('chitu');

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
    storeId: '58401d1906c02a2b8877bd13',
    get userToken() {
        return '584cfabb4918e4186a77ff1e';
    },
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 10,
    pageSize: 10
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


//let token = '';

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
    if (path.startsWith(`http://localhost:${location.port}`)) {
        path = path.substr(`http://localhost:${location.port}`.length);
    }
    else if (path.startsWith('http://localhost')) {
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


function serviceUrl(baseUrl, path) {
    return `${baseUrl}${path}?storeId=${storeId()}`;;
}

interface DataSourceSelectArguments {
    startRowIndex?: number,
    maximumRows?: number,
    filter?: string
}

interface DataSourceSelectResult<T> {
    DataItems: T[],
    MaximumRows?: number,
    StartRowIndex?: number,
    TotalRowCount: number
}

export type News = { Id: string, Title: string, ImgUrl: string, Date: Date, Content: string };

export abstract class Service {
    private datePrefix = '/Date(';
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

    private parseStringToDate(value: string) {
        let prefix = this.datePrefix;
        var star = prefix.length;
        var len = value.length - prefix.length - ')/'.length;
        var str = value.substr(star, len);
        var num = parseInt(str);
        var date = new Date(num);
        return date;
    }
    private travelJSON(result: any) {
        var prefix = this.datePrefix;
        if (typeof result === 'string') {
            if (result.substr(0, prefix.length) == prefix)
                result = this.parseStringToDate(result);
            return result;
        }
        var stack = new Array();
        stack.push(result);
        while (stack.length > 0) {
            var item = stack.pop();
            for (var key in item) {
                var value = item[key];
                if (value == null)
                    continue;

                if (value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        stack.push(value[i]);
                    }
                    continue;
                }
                if (typeof value == 'object') {
                    stack.push(value);
                    continue;
                }
                if (typeof value == 'string' && value.substr(0, prefix.length) == prefix) {
                    item[key] = this.parseStringToDate(value);
                }
            }
        }
        return result;
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

            textObject = this.travelJSON(textObject);
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
            //item.Date = parseDate(item.Date).toLocaleDateString();
            let div = document.createElement('div');
            div.innerHTML = item.Content;
            let imgs = div.querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                (imgs[i] as HTMLImageElement).src = imageUrl((imgs[i] as HTMLImageElement).src);
            }

            item.Content = div.innerHTML;

            return item;
        });
    }

    searchKeywords() {
        return this.get<Array<string>>(StationService.url('Home/GetSearchKeywords'));
    }

    historySearchWords() {
        return this.get<Array<string>>(StationService.url('Home/HistorySearchWords'));
    }

    advertItems(): Promise<{ ImgUrl: string, Id: string }[]> {
        return this.get<{ ImgUrl: string }[]>(StationService.url('Home/GetAdvertItems')).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = StationService.url('Home/GetHomeProducts');
        return this.get<HomeProduct[]>(url, { pageIndex }).then((products) => {
            products.forEach(o => o.ImagePath = imageUrl(o.ImagePath));
            return products;
        });
    }
}

export interface HomeProduct {
    Id: string, Name: string, ImagePath: string,
    ProductId: string, Price: number, PromotionLabel: string
};
export interface CustomProperty {
    Name: string,
    Options: Array<{ Name: string, Selected: boolean, Value: string }>
}
export interface Product {
    Id: string, Arguments: Array<{ key: string, value: string }>,
    BrandId: string, BrandName: string, Price: number,
    Score: number, Unit: string, MemberPrice: number,
    Fields: Array<{ key: string, value: string }>,
    GroupId: string, ImageUrl: string, ImageUrls: Array<string>,
    ProductCategoryId: string, Name: string, //IsFavored?: boolean,
    ProductCategoryName: string,
    CustomProperties: Array<CustomProperty>,
    Promotions: Promotion[]
};
export interface Promotion {
    Type: 'Given' | 'Reduce' | 'Discount',
    Contents: {
        Id: string,
        Description: string
    }[],
}
export type FavorProduct = {
    Id: string;
    ProductId: string,
    ProductName: string,
    ImageUrl: string
}
export interface ProductCategory {
    Id: string, Name: string, ImagePath: string
}
export interface Order {
    Id: string,
    Amount: number,
    BalanceAmount: number,
    CouponTitle: string,
    Discount: number,
    Freight: number,
    Invoice: string,
    OrderDate: Date,
    OrderDetails: OrderDetail[],
    ReceiptAddress: string,
    Serial: string,
    Status: string,
    StatusText: string,
    Sum: number,
}
export interface OrderDetail {
    ImageUrl: string,
    ProductId: string,
    ProductName: string,
    Price: number,
    Quantity: number,
    Score: number
}
export interface ReceiptInfo {
    Address: string,
    CityId: string,
    CityName: string,
    Consignee: string,
    CountyId: string,
    CountyName: string,
    FullAddress: string,
    Id: string,
    IsDefault: boolean,
    Mobile: string,
    Name: string,
    Phone: string,
    PostalCode: string,
    ProvinceId: string,
    ProvinceName: string,
    RegionId: string
}
export interface Region {
    Id: string,
    Name: string
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
        return this.get<Product>(url, { productId })
            .then(product => this.processProduct(product));
    }
    productByProperies(groupId: string, properties: { [propName: string]: string }): Promise<Product> {
        type t = { key: string };
        var d = { groupId, filter: JSON.stringify(properties) };
        return this.get<Product>(ShopService.url('Product/GetProductByPropertyFilter'), d)
            .then(o => this.processProduct(o));
    }
    private processProduct(product: Product): Product {
        if (!product.ImageUrls && product.ImageUrl != null)
            product.ImageUrls = (<string>product.ImageUrl).split(',').map(o => imageUrl(o));

        product.ImageUrl = product.ImageUrls[0];
        product.Arguments = product.Arguments || [];
        product.Fields = product.Fields || [];

        return product;
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
    category(categoryId: string) {
        let url = ShopService.url('Product/GetCategory');
        return this.get<ProductCategory>(url, { categoryId });
    }
    cateories() {
        let url = ShopService.url('Product/GetCategories');
        return this.get<ProductCategory[]>(url).then(items => {
            items.forEach(o => o.ImagePath = imageUrl(o.ImagePath));
            return items;
        });
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
    favorProduct(productId: string) {
        return this.post(ShopService.url('Product/FavorProduct'), { productId });
    }
    //=====================================================================
    // 订单
    balancePay(orderId: string, amount: number) {
        type TResult = { Id: string, Amount: number, BalanceAmount: number };
        return this.post<TResult>(ShopService.url('Order/BalancePay'), { orderId: orderId, amount: amount });
    }
    myOrderList(pageIndex, type?: 'WaitingForPayment' | 'Send') {
        let args = {} as DataSourceSelectArguments;
        args.startRowIndex = config.pageSize * pageIndex;
        args.maximumRows = config.pageSize;
        if (type)
            args.filter = `Status="${type}"`

        return this.get<Order[]>(ShopService.url('Order/GetMyOrderList'), args)
            .then(orders => {
                orders.forEach(o => {
                    o.OrderDetails.forEach(c => c.ImageUrl = imageUrl(c.ImageUrl));
                });
                return orders;
            });
    }
    order(orderId: string) {
        return this.get<Order>(ShopService.url('Order/GetOrder'), { orderId }).then(o => {
            o.OrderDetails.forEach(c => c.ImageUrl = imageUrl(c.ImageUrl));
            return o;
        });
    }
    createOrder(productIds: string[], quantities: number[]) {
        var result = this.post<Order>(ShopService.url('Order/CreateOrder'), { productIds: productIds, quantities: quantities })
            .then(function (order) {
                return order;
            });
        return result;
    }
    //=====================================================================
    // Address
    receiptInfos() {
        return this.get<ReceiptInfo[]>(ShopService.url('Address/GetReceiptInfos'));
    }
    receiptInfo(id: string) {
        return this.get<ReceiptInfo>(ShopService.url('Address/GetReceiptInfo'), { id })
            .then(o => {
                o.RegionId = o.CountyId;
                return o;
            });
    }
    provinces(): Promise<Region[]> {
        var result = this.get<Region[]>(ShopService.url('Address/GetProvinces'))
        return result;
    }
    cities(province: string): Promise<Region[]> {
        var guidRule = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (guidRule.test(province))
            return this.get<Region[]>('Address/GetCities', { provinceId: province });

        return this.get<Region[]>('Address/GetCities', { provinceName: province });;
    }
    counties = (cityId: string) => {
        var result = this.get<Region[]>('Address/GetCounties', { cityId: cityId });
        return result;
    }
    saveReceiptInfo(receiptInfo: ReceiptInfo) {
        var self = this;
        var result = this.post<{ Id: string, IsDefault: boolean }>('Address/SaveReceiptInfo', receiptInfo);
        return result;
    }
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
    Type: 'Reduce' | 'Discount'
}

export class ShoppingCartService extends Service {
    constructor() {
        super();
        let _userToken = userToken();
        if (_userToken) {

        }
    }
    private url(path: string) {
        return `${config.service.shop}${path}?storeId=${storeId()}`;
    }
    private processShoppingCartItems(items: ShoppingCartItem[]) {
        for (let i = 0; i < items.length; i++) {
            items[i].ImageUrl = imageUrl(items[i].ImageUrl);
            if (items[i].Remark) {
                Object.assign(items[i], JSON.parse(items[i].Remark));
            }
        }
        return items;
    }

    addItem(productId: string, count?: number) {
        count = count || 1;
        return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/AddItem'), { productId, count })
            .then((result) => this.processShoppingCartItems(result));
    }

    updateItem(productId: string, count: number, selected: boolean) {
        let data = { productId: productId, count: count, selected: selected };
        return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/UpdateItem'), data)
            .then(items => this.processShoppingCartItems(items));
    }

    items() {
        return this.get<ShoppingCartItem[]>(this.url('ShoppingCart/GetItems'))
            .then(items => this.processShoppingCartItems(items));
    }

    productsCount() {
        return this.get<number>(this.url('ShoppingCart/GetProductsCount'));
    }

    selectAll = () => {
        return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/SelectAll'))
            .then(items => this.processShoppingCartItems(items));
    }

    unselectAll = () => {
        return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/UnselectAll'))
            .then(items => this.processShoppingCartItems(items));
    }


}

interface UserInfo1 {
    Id: string,
    Email: string,
    Mobile: string,
    OpenId: string,
    PasswordSetted: boolean,
    PaymentPasswordSetted: boolean,
    UserName: string,
    HeadImageUrl: string,
}

interface UserInfo2 {
    Balance: number,
    NotPaidCount: number,
    Score: number,
    SendCount: number,
    ShoppingCartItemsCount: number,
    NickName: string,
    ToEvaluateCount: number,
}

export type UserInfo = UserInfo1 & UserInfo2;


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

export class AccountService extends Service {
    private url(path: string) {
        return `${config.service.account}${path}?storeId=${storeId()}`;
    }

    /**
     * 获取用户账户的余额
     */
    balance = () => {
        return this.get<UserInfo2>(this.url('Account/GetAccount')).then(function (data) {
            return (new Number(data.Balance)).valueOf();
        });
    }
}

