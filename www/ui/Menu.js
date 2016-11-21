define(["require", "exports", 'services/ShoppingCart'], function (require, exports, shoppingCart) {
    "use strict";
    var menu_html;
    class Menu {
        constructor(parentNode, routeData) {
            this.node = document.createElement('div');
            parentNode.appendChild(this.node);
            var updateProductsCount = () => {
                var $products_count = $(this.node).find('[name="products-count"]');
                if (shoppingCart.info.itemsCount() == 0) {
                    $products_count.hide();
                }
                else {
                    $products_count.show();
                }
                $products_count.text(shoppingCart.info.itemsCount());
            };
            shoppingCart.info.itemsCount.subscribe(updateProductsCount);
            this.loadHTML().done((html) => {
                this.node.innerHTML = html;
                var args = routeData.values;
                var $tab = $(this.node).find('[name="' + args.controller + '_' + args.action + '"]');
                if ($tab.length > 0) {
                    $tab.addClass('active');
                }
                updateProductsCount();
            });
        }
        loadHTML() {
            if (menu_html)
                return $.Deferred().resolve(menu_html);
            var deferred = $.Deferred();
            requirejs(['text!ui/Menu.html'], function (html) {
                menu_html = html;
                deferred.resolve(html);
            });
            return deferred;
        }
    }
});
