import { Page, defaultNavBar } from 'site';
import * as ui from 'ui';
import * as services from 'services';
import { app } from 'site';
import FormValidator = require('core/formValidator');
let { PageComponent, PageHeader, PageFooter, PageView, Button, DataList } = controls;

export default function (page: Page) {
    let member = page.createService(services.MemberService);
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let formElement: HTMLFormElement;
    let validator: FormValidator;

    let returnString = page.routeData.values.reutrn || 'user_index';

    var jsx =
        <PageComponent>
            <PageHeader>
                {defaultNavBar({ title: "登录" })}
            </PageHeader>
            <PageFooter></PageFooter>
            <PageView>
                <form className="form-horizontal container"
                    ref={(e: HTMLFormElement) => formElement = e || formElement}>
                    <div className="form-group">
                        <div className="col-xs-12">
                            <input type="text" name="username" className="form-control" placeholder="手机号码"
                                ref={(e: HTMLInputElement) => usernameInput = e || usernameInput} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-12">
                            <input type="password" name="password" className="form-control" placeholder="密码"
                                ref={(e: HTMLInputElement) => passwordInput = e || passwordInput} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-12">
                            <button id="Login" type="button" className="btn btn-primary btn-block"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(async () => {
                                        if (!validator) {
                                            validator = new FormValidator(formElement, {
                                                username: {
                                                    rules: ['required', 'mobile'],
                                                    display: '手机号码'
                                                },
                                                password: { rules: ['required'], display: '密码' }
                                            });
                                        }

                                        if (!validator.validateForm())
                                            return;

                                        await member.login(usernameInput.value, passwordInput.value);
                                        app.redirect(returnString);
                                    });
                                }}>立即登录</button>
                        </div>
                        <div className="col-xs-12 text-center" style={{ marginTop: 10 }}>
                            <a href="#user_register" className="pull-left">我要注册</a>
                            <a href="#user_resetPassword" className="pull-right">忘记密码</a>
                        </div>
                    </div>
                </form>
            </PageView>
        </PageComponent>;

    ReactDOM.render(jsx, page.element);
}