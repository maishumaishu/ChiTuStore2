import { Page } from 'site';
import Vue = require('vue');
import { MemberService } from 'services';
import 'controls/imageBox';


export default async function (page: Page) {
    let member = page.createService(MemberService);
    let userInfo = await member.userInfo();
    let data = {
        userInfo
    }
    let vm = new Vue({
        el: page.dataView,
        data,
        render(h) {
            return (
                <section class="main">
                    <div class="user-info">
                        <a href="#User_UserInfo" class="pull-left" style="margin:-8px 20px 0px 0px">
                            <imageBox src={data.userInfo.HeadImageUrl} class="img-circle img-full" />
                        </a>

                        <div>
                            <div style="width:100%;">
                                <a class="nick-name" domProps-innerHTML={userInfo.NickName == null ? '未填写' : userInfo.NickName} href="#User_UserInfo">
                                </a>
                            </div>
                            <div class="pull-left">
                                <h5 style="color:white;">普通用户</h5>
                            </div>
                            <div class="pull-right">
                                <a href="#User_RechargeList" style="color:white">
                                    <h5>余额&nbsp;&nbsp;
                                        <span domProps-innerHTML={'￥' + userInfo.Balance.toFixed(2)} class="price"></span>&nbsp;&nbsp;
                                        <span class="icon-chevron-right"></span>
                                    </h5>
                                </a>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="order-bar" style="">
                        <div class="col-xs-3">
                            <a href="#shopping_orderList" style="color:black">
                                <i class="icon-list icon-3x"></i>
                                <div class="name">全部订单</div>
                            </a>
                        </div>
                        <div class="col-xs-3 ">
                            <a href="#shopping_orderList?type=WaitingForPayment" style="color:black">
                                <sub data-bind="visible:ko.unwrap(notPaidCount)>0, html:notPaidCount" class="sub" domProps-innerHTML={userInfo.NotPaidCount}>35</sub>
                                <i class="icon-credit-card icon-3x"></i>
                                <div class="name">待付款</div>
                            </a>
                        </div>
                        <div class="col-xs-3">
                            <a href="#shopping_orderList?type=Send" style="color:black">
                                <sub data-bind="visible:ko.unwrap(toReceiveCount)>0, html:toReceiveCount" class="sub" domProps-innerHTML={userInfo.SendCount}></sub>
                                <i class="icon-truck icon-3x"></i>
                                <div class="name">待收货</div>
                            </a>
                        </div>
                        <div class="col-xs-3">
                            <a href="#shopping_evaluation" style="color:black;">
                                <sub data-bind="visible:ko.unwrap(evaluateCount)>0, html:evaluateCount" class="sub" domProps-innerHTML={userInfo.ToEvaluateCount}></sub>
                                <i class="icon-star icon-3x"></i>
                                <div class="name">待评价</div>
                            </a>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="list-group">
                        <a class="list-group-item" href="#user_receiptList">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;"></span>
                            <strong>收货地址</strong>
                        </a>

                        <a class="list-group-item" href="#user_favors">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;"></span>
                            <strong>我的收藏</strong>
                        </a>

                        <a class="list-group-item" href="#user_scoreList">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;">0</span>
                            <strong>我的积分</strong>
                        </a>

                        <a class="list-group-item" href="#user_coupon">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;">undefined</span>
                            <strong>我的优惠券</strong>
                        </a>
                    </div>

                    <div class="list-group">
                        <a data-bind="attr:{href:url}" class="list-group-item" href="#AccountSecurity_Index">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;"></span>
                            <strong>账户安全</strong>
                        </a>

                        <a data-bind="attr:{href:url}" class="list-group-item" href="#User_Index_Logout">
                            <span class="icon-chevron-right pull-right"></span>
                            <span data-bind="text: value,visible:value" class="pull-right value" style="display: none;">undefined</span>
                            <strong>退出</strong>
                        </a>
                    </div>
                </section>
            );
        }
    })

    page.loadingView.style.display = 'none';
}