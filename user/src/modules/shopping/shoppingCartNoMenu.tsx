import { Page } from 'site';
import { ShoppingCartService, ShoppingCartItem } from 'services';
import { default as createShoppingCartPage } from 'modules/shopping/shoppingCart';

export default function (page: Page) {
    createShoppingCartPage(page, true);
}