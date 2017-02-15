import { Page, defaultNavBar, app } from 'site';
import { ShopService, ReceiptInfo, Order, MemberService } from 'services';
let { PageComponent, PageHeader, PageView, Button, DataList } = controls;

export default function (page: Page) {
    let member = page.createService(MemberService);
    class UserInfoComponent extends React.Component<{}, {}>{
        constructor(props) {
            super(props);
            //member.userInfo()
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '用户信息' })}
                    </PageHeader>
                    <PageView>
                        <div className="container">
                            <div className="list-group">
                                <div className="list-group-item row">
                                    <div className="col-xs-3">
                                        <label style={{ position: 'relative', top: 30 }}>
                                            头像
                                        </label>
                                    </div>
                                    <div className="col-xs-9">
                                        <div className="pull-right" style={{ paddingLeft: 10, position: 'relative', top: 30 }}>
                                            <i className="icon-chevron-right"></i>
                                        </div>

                                        <img data-bind="attr:{src:userInfo.HeadImageUrl}" className="img-circle pull-right" style={{ width: 70, height: 70 }} />
                                        <input type="file" style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: 90 }} accept="images/*" />
                                    </div>
                                </div>
                                <div className="list-group-item row">
                                    <label className="col-xs-3">
                                        昵称
                                    </label>
                                    <div data-bind="click:$root.edit('NickName'),tap:$root.edit('NickName')" className="col-xs-9" style={{ paddingLeft: 0 }}>
                                        <div className="pull-right" style={{ paddingLeft: 10 }}>
                                            <i className="icon-chevron-right"></i>
                                        </div>
                                        <div data-bind="text:userInfo.NickName,visible:userInfo.NickName" className="pull-right"></div>
                                        <div data-bind="visible:!ko.unwrap(userInfo.NickName)" className="pull-right text-danger">未填写</div>
                                    </div>
                                </div>
                                <div className="list-group-item row">
                                    <label className="col-xs-3">
                                        性别
                                    </label>
                                    <div data-bind="click:$root.edit('Gender'),tap:$root.edit('Gender')" className="col-xs-9" style={{ paddingLeft: 0 }}>

                                        <div className="pull-right" style={{ paddingLeft: 10 }}>
                                            <i className="icon-chevron-right"></i>
                                        </div>
                                        <div data-bind="text:ko.unwrap(userInfo.Gender)=='Male'?'男':'女',visible:ko.unwrap(userInfo.Gender)=='Male'||ko.unwrap(userInfo.Gender)=='Female'" className="pull-right"></div>
                                        <div data-bind="visible:ko.unwrap(userInfo.Gender)=='None'" className="pull-right text-danger">未填写</div>

                                    </div>
                                </div>
                                <div className="list-group-item row">
                                    <label className="col-xs-3">
                                        地区
                                    </label>
                                    <div data-bind="click:$root.edit('Region'),tap:$root.edit('Region')" className="col-xs-9" style={{ paddingLeft: 0 }}>
                                        <div className="pull-right" style={{ paddingLeft: 10 }}>
                                            <i className="icon-chevron-right"></i>
                                        </div>
                                        <div data-bind="text:ko.unwrap(userInfo.Region),visible:userInfo.Region" className="pull-right"></div>
                                        <div data-bind="visible:!ko.unwrap(userInfo.Region)" className="pull-right text-danger pull-right">未填写</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageView>
                </PageComponent>
            )
        }
    }

    ReactDOM.render(<UserInfoComponent />, page.element);
} 