import { Page, defaultNavBar, app, config } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, Button, DataList } = controls;
import FormValidator = require('core/formValidator');
import * as services from 'services';
import * as ui from 'ui';

export default function (page: Page) {
    let member = page.createService(services.MemberService);  //new services.MemberService();
    class RegisterPage extends React.Component<{}, { letfSeconds: number }> {
        private validator: FormValidator;
        private formElement: HTMLFormElement;
        private smsId: string;

        constructor() {
            super();
            this.state = { letfSeconds: 0 };
        }
        componentDidMount() {
            this.validator = new FormValidator(this.formElement, {
                mobile: {
                    rules: ['required', 'mobile'],
                    messages: { required: '请输入手机号码' }
                },
                verifyCode: {
                    rules: ['required'],
                    messages: { required: '请输入验证码' }
                },
                password: {
                    rules: ['required'],
                    messages: { required: '请输入密码' }
                },
                confirmPassword: {
                    rules: ['required', { name: 'matches', params: ['password'] }],
                    messages: {
                        required: '请再次输入密码',
                        matches: '两次输入的密码不匹配'
                    }
                }
            });
        }
        async  sendVerifyCode() {
            if (!this.validator.validateFields('mobile')) {
                return;
            }


            this.state.letfSeconds = 60;
            this.setState(this.state);
            let intervalId = setInterval(() => {
                this.state.letfSeconds = this.state.letfSeconds - 1;
                this.setState(this.state);

                if (this.state.letfSeconds <= 0) {
                    window.clearInterval(intervalId);
                }

            }, 1000);

            await member.sentRegisterVerifyCode(this.formElement['mobile'].value)
                .then((data) => {
                    this.smsId = data.smsId;
                })
                .catch(()=>{
                    this.state.letfSeconds = 0;
                    this.setState(this.state);
                });
        }
        register() {
            if (!this.validator.validateForm())
                return;

            let mobile = this.formElement['mobile'].value;
            let password = this.formElement['password'].value;
            let verifyCode = this.formElement['verifyCode'].value;
            return member.register({
                user: { mobile, password },
                smsId: this.smsId,
                verifyCode
            }).then(() => {
                app.redirect(config.defaultUrl);
            });
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: "用户注册" })}
                    </PageHeader>
                    <PageFooter></PageFooter>
                    <PageView>
                        <div className="container">
                            <form className="form-horizontal"
                                ref={(o: HTMLFormElement) => this.formElement = o || this.formElement}>
                                <div className="form-group">
                                    <div className="col-xs-12">
                                        <input className="form-control" type="text" name="mobile" placeholder="请输入手机号码" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-6">
                                        <input type="text" name="verifyCode" className="form-control" placeholder="验证码" />
                                    </div>
                                    <div className="col-xs-6">
                                        <button type="button" className="btn btn-block btn-success"
                                            disabled={this.state.letfSeconds > 0}
                                            onClick={() => this.sendVerifyCode()}>
                                            {this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码'}
                                        </button>
                                    </div>
                                    <div className="col-xs-12">
                                        <span className="verifyCode validationMessage"></span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-12">
                                        <input name="password" type="password" className="form-control" placeholder="请输入密码" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-12">
                                        <input name="confirmPassword" type="password" className="form-control" placeholder="请再一次输入密码" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-12">
                                        <button type="button" className="btn btn-primary btn-block"
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick(() => this.register(), { toast: '注册成功' });

                                            }}>立即注册</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </PageView>
                </PageComponent>
            );

        }
    }

    ReactDOM.render(<RegisterPage />, page.element);
}