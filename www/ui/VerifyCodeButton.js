define(["require", "exports", 'knockout', 'services/Member', 'knockout.validation', 'Site'], function (require, exports, ko, member, ko_val, site) {
    "use strict";
    class Model {
        constructor(args) {
            this.timeoutID = 0;
            this.leftSeconds = ko.observable(0);
            this.buttonText = ko.computed(() => {
                if (this.leftSeconds() == 0) {
                    return '发送验证码';
                }
                return '发送验证码(' + this.leftSeconds() + ')';
            });
            this.sendVerifyCode = () => {
                debugger;
                var obj = { mobile: this.args.mobile };
                var val = ko_val.group(obj);
                if (!obj['isValid']()) {
                    val.showAllMessages();
                    return $.Deferred().reject();
                }
                var result = this.args.checkMobile(this.args.mobile()).pipe((mobileAllowed) => {
                    if (!mobileAllowed)
                        return $.Deferred().reject();
                    return member.sendVerifyCode(this.args.mobile(), this.args.verifyType);
                }).done((data) => {
                    this.starButtonCounter();
                    this.smsId(data);
                });
                return result;
            };
            this.starButtonCounter = () => {
                this.leftSeconds(60);
                this.timeoutID = window.setInterval(() => {
                    var value = this.leftSeconds() - 1;
                    this.leftSeconds(value);
                    if (value == 0) {
                        window.clearInterval(this.timeoutID);
                    }
                }, 1000);
            };
            this.smsId = ko.pureComputed({
                write: (value) => {
                    site.cookies.set_value(this.smsIdName, value);
                },
                read: () => {
                    return site.cookies.get_value(this.smsIdName);
                }
            });
            var mobile_error = '该手机号码不允许使用';
            args.mobile.extend({ required: true, mobile: true });
            args.mobile.extend({
                validation: [{
                        async: true,
                        validator: function (value, params, callback) {
                            return args.checkMobile(value).done((chekcResult) => {
                                if (typeof chekcResult == 'string') {
                                    mobile_error = chekcResult;
                                    return callback(false);
                                }
                                return callback(chekcResult);
                            });
                        },
                        message: function () {
                            return mobile_error;
                        }
                    }]
            });
            args.verifyCode.extend({
                required: true,
                validation: [{
                        async: true,
                        validator: (value, params, callback) => {
                            value = value || '';
                            const VERIFY_CODE_MIN_LENGTH = 4;
                            if (value.length < VERIFY_CODE_MIN_LENGTH) {
                                return callback(false);
                            }
                            if (!this.smsId()) {
                                return callback(false);
                            }
                            return member.checkVerifyCode(this.smsId(), args.verifyCode(), args.mobile()).done((checkResult) => {
                                callback(checkResult);
                            });
                        },
                        message: '验证码不正确'
                    }]
            });
            this.args = args;
        }
        get smsIdName() {
            return this.args.verifyType + '_' + 'SmsId';
        }
    }
    ko.components.register('verify-code-button', {
        viewModel: function (params) {
            if (params.checkMobile == null)
                params.checkMobile = (mobile) => $.Deferred().resolve(true);
            var model = new Model(params);
            $.extend(this, model);
        },
        template: '<button data-bind="click:sendVerifyCode, disable:leftSeconds()>0, text:buttonText" \
             type="button" \
             class="btn btn-block btn-warning"> 发送验证码 </button>'
    });
});
