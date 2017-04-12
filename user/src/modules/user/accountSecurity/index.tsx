import { Page } from 'site';
import { defaultNavBar } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

export default function (page: Page) {
    class IndexPage extends React.Component<{}, {}>{
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '账户安全' })}
                    </PageHeader>
                    <PageView>
                        <div className="container">
                            <div className="list-group">
                                <a data-bind="attr:{href:mobileBindingUrl}" href="#AccountSecurity_Setting_MobileBinding" className="list-group-item row">
                                    <strong className="name">手机绑定</strong>
                                    <i className="icon-chevron-right pull-right"></i>
                                    <span className="pull-right text-primary" style={{ paddingRight: 10 }}>
                                        未设置
                                    </span>
                                    <div style={{ paddingTop: 10 }}>绑定手机后，你可以通过手机找回密码</div>
                                </a>
                                <a href="#AccountSecurity_Setting_LoginPassword" className="list-group-item row">
                                    <strong className="name">登录密码</strong>
                                    <i className="icon-chevron-right pull-right"></i>
                                    <span data-bind="visible:!passwordSetted()" className="pull-right text-primary" style={{ paddingRight: 10 }}>未设置</span>
                                    <div style={{ paddingTop: 10 }}>设置登录密码，可以使用手机和密码登录</div>
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

    ReactDOM.render(<IndexPage />, page.element);
}