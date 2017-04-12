import { Page, Menu, app } from 'site';
import { MemberService, UserInfo, userData } from 'services';
let { PageComponent, PageHeader, PageFooter, PageView, DataList, ImageBox, Tabs } = controls;


export default async function (page: Page) {

    let member = page.createService(MemberService);

    class UserIndexPage extends React.Component<{}, { userInfo: UserInfo }>{
        private notPaidCountSubscribe: (value: number) => void;
        private sendCountSubscribe: (value: number) => void;
        private toEvaluateCountSubscribe: (value: number) => void;
        private balanceSubscribe: (value: number) => void;
        private nickNameSubscribe: (value: string) => void;

        constructor(props) {
            super(props);

            this.state = {
                userInfo: {
                    NotPaidCount: userData.notPaidCount.value,
                    SendCount: userData.sendCount.value,
                    ToEvaluateCount: userData.toEvaluateCount.value,
                    Balance: userData.balance.value,
                    NickName: userData.nickName.value
                } as UserInfo
            };

            this.createSubscribes();
        }

        private createSubscribes() {
            this.notPaidCountSubscribe = userData.notPaidCount.add((value) => {
                this.state.userInfo.NotPaidCount = value;
                this.setState(this.state);
            })

            this.sendCountSubscribe = userData.sendCount.add((value) => {
                this.state.userInfo.SendCount = value;
                this.setState(this.state);
            })

            this.toEvaluateCountSubscribe = userData.toEvaluateCount.add(value => {
                this.state.userInfo.ToEvaluateCount = value;
                this.setState(this.state);
            })

            this.balanceSubscribe = userData.balance.add(value => {
                this.state.userInfo.Balance = value;
                this.setState(this.state);
            })

            this.nickNameSubscribe = userData.nickName.add(value => {
                this.state.userInfo.NickName = value;
                this.setState(this.state);
            })
        }

        private logout() {
            member.logout();
            app.redirect('home_index');
        }

        render() {
            let userInfo = this.state.userInfo;
            return (
                <PageComponent>
                    <PageView>
                        <div className="user-info">
                            <a href="#user_userInfo" className="pull-left" style={{ margin: '-8px 20px 0px 0px' }}>
                                <ImageBox src={userInfo.HeadImageUrl} className="img-circle img-full" />
                            </a>

                            <div>
                                <div style={{ width: '100%' }}>
                                    <a className="nick-name" href="#user_userInfo">
                                        {userInfo.NickName == null ? '未填写' : userInfo.NickName}
                                    </a>
                                </div>
                                <div className="pull-left">
                                    <h5 style={{ color: 'white' }}>普通用户</h5>
                                </div>
                                {userInfo.Balance != null ?
                                    <div className="pull-right">
                                        <a href="#user_rechargeList" style={{ color: 'white' }}>
                                            <h5>余额&nbsp;&nbsp;
                                        <span className="price">￥{userInfo.Balance.toFixed(2)}</span>&nbsp;&nbsp;
                                        <span className="icon-chevron-right"></span>
                                            </h5>
                                        </a>
                                    </div>
                                    : null}
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="order-bar">
                            <div className="col-xs-3">
                                <a href="#shopping_orderList" style={{ color: 'black' }}>
                                    <i className="icon-list icon-3x"></i>
                                    <div className="name">全部订单</div>
                                </a>
                            </div>
                            <div className="col-xs-3 ">
                                <a href="#shopping_orderList?type=WaitingForPayment" style={{ color: 'black' }}>
                                    {userInfo.NotPaidCount ? <sub className="sub">{userInfo.NotPaidCount}</sub> : null}
                                    <i className="icon-credit-card icon-3x"></i>
                                    <div className="name">待付款</div>
                                </a>
                            </div>
                            <div className="col-xs-3">
                                <a href="#shopping_orderList?type=Send" style={{ color: 'black' }}>
                                    {userInfo.SendCount ? <sub className="sub">{userInfo.SendCount}</sub> : null}
                                    <i className="icon-truck icon-3x"></i>
                                    <div className="name">待收货</div>
                                </a>
                            </div>
                            <div className="col-xs-3">
                                <a href="#shopping_evaluation" style={{ color: 'black' }}>
                                    {userInfo.ToEvaluateCount ?
                                        <sub className="sub">{userInfo.ToEvaluateCount}</sub> : null}
                                    <i className="icon-star icon-3x"></i>
                                    <div className="name">待评价</div>
                                </a>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="list-group">
                            <a className="list-group-item" href="#user_receiptList">
                                <span className="icon-chevron-right pull-right"></span>
                                <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}></span>
                                <strong>收货地址</strong>
                            </a>

                            <a className="list-group-item" href="#user_favors">
                                <span className="icon-chevron-right pull-right"></span>
                                <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}></span>
                                <strong>我的收藏</strong>
                            </a>

                            <a className="list-group-item" href="#user_scoreList">
                                <span className="icon-chevron-right pull-right"></span>
                                <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}>0</span>
                                <strong>我的积分</strong>
                            </a>

                            <a className="list-group-item" href="#user_coupon">
                                <span className="icon-chevron-right pull-right"></span>
                                <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}>undefined</span>
                                <strong>我的优惠券</strong>
                            </a>
                        </div>

                        <div className="list-group">
                            <a className="list-group-item" href="#user_accountSecurity_index">
                                <span className="icon-chevron-right pull-right"></span>
                                <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}></span>
                                <strong>账户安全</strong>
                            </a>

                            <a className="list-group-item" href="javascript:"
                                onClick={() => this.logout()}>
                                <span className="icon-chevron-right pull-right"></span>
                                <span className="pull-right value" style={{ display: 'none' }}></span>
                                <strong>退出</strong>
                            </a>
                        </div>
                    </PageView>
                    <PageFooter>
                        <Menu pageName={page.name} />
                    </PageFooter>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<UserIndexPage />, page.element);
}
