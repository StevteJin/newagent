//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';



class userdetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            detail: {
                cashScale: 0,
                commission: 0,
                cordonLine: 0,
                financePeriod: 'day',
                financeRatio: 0,
                financeStartDate: '',
                flatLine: 0,
                manageFeeRate: 0,
                manageMakeFeeRate: 0,
                opUserCode: '',
                positionRatio: 0,
                secondBoardPositionRatio: 0
            },
            type: {
                day: '按使用金额收取固定收益',
                month: '按申请金额收取固定收益',
                week: '周配',
                single: '按个股盈利分成'
            },
            typeNum: "按使用金额收取固定收益"
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        this.getInfo();
    }
    componentWillUnmount = () => {
        let that = this;
        window.removeEventListener('resize', that.box);
        this.setState = (state, callback) => {
            return;
        };
    }

    getInfo() {
        let url = '/tn/tntg/userInfo', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            let freezaFee = parseFloat(res.lockScale) + parseFloat(res.freezeScale);
            let allottedScale = res.allottedScale;
            let typeNum = this.state.type[res.financePeriod]
            this.setState({
                detail: res,
                typeNum: typeNum
            })

        }, error => {
            console.log(error.response)
            if (error.response.status == 400) {
                let data = JSON.stringify(error.response.data.resultInfo);
                data = data.replace(/^(\s|")+|(\s|")+$/g, '');
                this.setState({
                    visible: true,
                    msg: data
                }, () => {

                })
            }
        });
    }
    box = () => {
        this.browserRedirect();
    }


    handleOk = e => {
        console.log(e);
        if (this.state.msg == '请重新登录') {
            this.props.history.push('/login');
        }
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    browserRedirect() {
        let isPc;
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            isPc = true
        } else {
            isPc = false
        }
        this.setState({
            isPc: isPc
        })
        console.log('哪一端', isPc);
        return isPc;
    }

    back() {
        this.props.history.push('/usercenter');
    }

    render() {
        const { isPc, detail, typeNum } = this.state;
        return (
            <div>
                <div class="navigation">
                    <div class="back" onClick={() => this.back()}></div>
                    <p class="navigation-title">个人详情</p>
                </div>
                <div class="content">
                    <div class="cell-list">
                        <div class="list-item">
                            <span class="list-item-name">保证金</span>
                            <span class="list-item-content">
                                {detail.cashScale}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                管理费率
                        </span>
                            <span class="list-item-content">
                                {detail.manageFeeRate}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                建仓费率
                        </span>
                            <span class="list-item-content">
                                {detail.manageMakeFeeRate}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                警戒线
                        </span>
                            <span class="list-item-content">
                                {detail.cordonLine}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                平仓线
                        </span>
                            <span class="list-item-content">
                                {detail.flatLine}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                单票持仓比例
                        </span>
                            <span class="list-item-content">
                                {detail.positionRatio}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                创业板持仓比例
                        </span>
                            <span class="list-item-content">
                                {detail.secondBoardPositionRatio}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                策略方案
                        </span>
                            <span class="list-item-content">
                                {detail.financeRatio}倍
                        </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                策略周期
                        </span>
                            <span class="list-item-content">
                                {typeNum}
                            </span>
                        </div>
                        <div class="list-item">
                            <span class="list-item-name">
                                策略开始日期
                        </span>
                            <span class="list-item-content">
                                {detail.financeStartDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default userdetail;