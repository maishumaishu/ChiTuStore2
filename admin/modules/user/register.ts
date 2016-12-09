import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import FormValidator = require('validate');
import { app, config } from 'site';

export default action(function (page: Page) {
    page.load.add(page_load);
});

function page_load(page: Page) {

    let model: services.RegisterModel = {
        smsId: '584abde78014e41c58ee2a50',
        verifyCode: '',
        user: {
            mobile: '',
            password: ''
        }
    }

    let data = {
        letfSeconds: 0,
        confirmPassword: '',
        model,
    };

    let validator: FormValidator;
    let intervalId: number;

    let vm = new Vue({
        el: page.dataView,
        data,
        methods: {
            sendVerifyCode: function () {
                if (!validator.validateFields('mobile')) {
                    return Promise.resolve();
                }

                let mobile = data.model.user.mobile;
                return services.user.sendVerifyCode(mobile).then((result) => {
                    data.letfSeconds = 60;
                    intervalId = setInterval(() => {
                        data.letfSeconds = data.letfSeconds - 1;
                        if (data.letfSeconds > 0)
                            return;

                        console.assert(intervalId != null);
                        window.clearInterval(intervalId);
                        intervalId = null;

                    }, 1000);

                    data.model.smsId = result.smsId;
                });

            },
            register: function () {
                if (!validator.validateForm()) {
                    return;
                }

                services.user.register(data.model).then(() => {
                    app.redirect(config.defaultUrl);
                });
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
                { name: 'mobile', display: '手机号码', rules: 'required|callback_mobile' },
                { name: 'verifyCode', display: '验证码', rules: 'required' },
                { name: 'password', display: '密码', rules: 'required' },
                { name: 'confirmPassword', display: '确认密码', rules: 'required' }
            ]);
            validator
                .registerCallback('mobile', function (value) {
                    value = value || '';
                    return value.length == 11 && /^1[34578]\d{9}$/.test(value);
                })
                .setMessage('mobile', '手机号码不正确')
        }
    });
}
