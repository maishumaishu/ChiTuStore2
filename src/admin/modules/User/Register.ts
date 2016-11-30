import { Page, action } from 'chitu.mobile';
import * as services from 'services';
import { createVueInstance } from 'vue.ext'
import Carousel = require('carousel');

export default action(function (page: Page, pageLoadPromise: Promise<any>) {

    Promise.all([pageLoadPromise]).then(() => {
        let data = {
            letfSeconds: 0,
            user: {
                mobile: '18502146746',
                password: ''
            }
        };

        let intervalId: number;
        let vm = new Vue({
            el: page.element,
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
                    //services.user.sendVerifyCode(data.user.mobile)
                }
            },
            computed: {
                sendButtonText: function () {
                    if (data.letfSeconds == 0)
                        return '发送验证码';

                    return `发送验证码(${data.letfSeconds})`;
                }
            }
        })

    });

});
