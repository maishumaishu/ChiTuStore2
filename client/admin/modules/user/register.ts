import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import FormValidator = require('validate');

export default action(function (page: Page) {

    let data = {
        letfSeconds: 0,
        user: {
            mobile: '',
            password: ''
        }
    };

    let intervalId: number;
    let vm = new Vue({
        el: page.dataView,
        data,
        methods: {
            sendVerifyCode: function () {
                data.letfSeconds = 60;
                intervalId = setInterval(() => {
                    data.letfSeconds = data.letfSeconds - 1;
                    if (data.letfSeconds > 0)
                        return;

                    console.assert(intervalId != null);
                    window.clearInterval(intervalId);
                    intervalId = null;

                }, 1000);
            },
            register: function () {
                if (!validator.validateForm()) {
                    return;
                }
                
            }
        },
        computed: {
            sendButtonText: function () {
                if (data.letfSeconds == 0)
                    return '发送验证码';

                return `发送验证码(${data.letfSeconds})`;
            }
        },
        mounted: function () {
            let self = this as VueInstance;
            let formElement = self.$el.querySelector('form') as HTMLElement;
            validator = new FormValidator(formElement, [
                { name: '手机号码', rules: 'required' },
                { name: '验证码', rules: 'required' },
                { name: '密码', rules: 'required' },
                { name: '确认密码', rules: 'required' }
            ]);

        }
    });

    //});
    let validator: FormValidator;

});
