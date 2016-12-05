import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import FormValidator = require('validate');
import app = require('application');

console.assert(app.currentPage != null);

let data = {
    username: '',
    password: ''
}



export default action(function (page) {

    let validator: FormValidator;

    let vm = new Vue({
        el: page.mainView,
        data,
        mounted: function () {
            let vm = this as VueInstance;
            let fromElement = vm.$el.querySelector('form') as HTMLElement;
            validator = new FormValidator(fromElement, [
                { name: '用户名', rules: 'required' },
                { name: '密码', rules: 'required' }
            ]);
        },
        methods: {
            login: function () {
                if (!validator.validateForm()) {
                    return;
                }
                services.user.login(data.username, data.password).then(result => {
                    debugger;
                });
            }
        }
    });
});