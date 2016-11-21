import { Page, action } from 'chitu.mobile';
import * as services from 'services';

export default action((page: Page) => {
    let { id } = page.routeData.values
    let result = services.home.getProduct(id).then((product) => {
        let vm = new Vue({
            el: page.mainView,
            data: {
                product
            }
        })
    });

    return result;
});