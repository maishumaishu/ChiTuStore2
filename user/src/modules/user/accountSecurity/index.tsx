import { Page } from 'site';
import { defaultNavBar, app } from 'site';
import * as services from 'services';
import { MobileBindingPageArguments } from 'modules/user/accountSecurity/mobileBinding';

let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;


export default function (page: Page) {
    class IndexPage extends React.Component<{ userInfo: services.UserInfo }, { userInfo: services.UserInfo }>{
        constructor(props) {
            super(props);
            this.state = { userInfo: this.props.userInfo };
        }
        showMobileBindingPage() {
            let args: MobileBindingPageArguments = {
                mobileChanged: (value) => {
                    this.state.userInfo.Mobile = value;
                    this.setState(this.state);
                }
            }
            app.redirect('user_accountSecurity_mobileBinding', args);
        }
        render() {
            let userInfo = this.state.userInfo;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '账户安全' })}
                    </PageHeader>
                    <PageView>
                        <div className="container">
                            <div className="list-group">
                                <a href="#user_accountSecurity_loginPassword" className="list-group-item row">
                                    <strong className="name">登录密码</strong>
                                    <i className="icon-chevron-right pull-right"></i>
                                    {/*<span data-bind="visible:!passwordSetted()" className="pull-right text-primary" style={{ paddingRight: 10 }}>未设置</span>*/}
                                    <div style={{ paddingTop: 10 }}>设置登录密码，可以使用手机和密码登录</div>
                                </a>
                                <a href="javascript:" className="list-group-item   row" onClick={()=>this.showMobileBindingPage()}>
                                    <strong className="name">手机绑定</strong>
                                    <i className="icon-chevron-right pull-right"></i>
                                    <span className={userInfo.Mobile ? 'pull-right' : "pull-right text-primary"} style={{ paddingRight: 10 }}>
                                        {userInfo.Mobile ? userInfo.Mobile : '未设置'}
                                    </span>
                                    <div style={{ paddingTop: 10 }}>绑定手机后，你可以通过手机找回密码</div>
                                </a>
                                <a href="#AccountSecurity_Setting_PaymentPassword" className="list-group-item row">
                                    <strong className="name">支付密码</strong>
                                    <i className="icon-chevron-right pull-right"></i>
                                    <span data-bind="visible:!paymentPasswordSetted()" className="pull-right text-primary" style={{ paddingRight: 10 }}>未设置</span>
                                    <div style={{ paddingTop: 10 }}>设置支付密码后，使用余额支付需要密码</div>
                                </a>
                            </div>
                            <div className="list-group">
                            </div>
                        </div>
                    </PageView>
                </PageComponent>
            )
        }
    }


    let member = new services.MemberService();
    member.userInfo().then(userInfo => {
        ReactDOM.render(<IndexPage userInfo={userInfo} />, page.element);
    })
}