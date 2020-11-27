//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import financingDetails from './img/financing _details1.png';
import capitalFlow from './img/capital_flow1.png';
import bankCard from './img/bank_card1.png';
import closeCase from './img/close_case1.png';
import changePwd from './img/change_pwd1.png';


class usercenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            userInfo: "",
            freezaFee: "",
            allottedScale: 0,
            visible: false,
            msg: ""
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
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            let freezaFee = parseFloat(res.lockScale) + parseFloat(res.freezeScale);
            let allottedScale = res.allottedScale;
            this.setState({
                userInfo: res,
                freezaFee: freezaFee,
                allottedScale: allottedScale
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
        if (this.state.msg == '确定结案？') {
            let url = '/tn/tntg/Strategy', method = 'post', options = null;
            httpAxios(url, method, false, options).then(res => {
                this.setState({
                    visible: true,
                    msg: '结案成功'
                }, () => {
                    this.getInfo();
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
    toWhere(where) {
        this.props.history.push(where);
    }
    logout() {
        localStorage.clear();
        this.props.history.push('/login');
    }
    submit() {
        if (this.state.allottedScale != 0) {
            this.setState({
                visible: true,
                msg: '确定结案？'
            })
        } else {
            this.setState({
                visible: true,
                msg: '此账户还没有申请策略，没有可结束的方案'
            })
        }
    }
    render() {
        const { isPc, userInfo, freezaFee, allottedScale } = this.state;
        return (
            <div className="userbox">
                <Modal
                    title="提示"
                    centered
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消">
                    <p>{this.state.msg}</p>
                </Modal>
                <div className="user-center-top">
                    <div className="user-center-header">
                        <div className="user-name">{userInfo.accountName}</div>
                        <div className="logout-box" onClick={() => this.logout()}>退出账户</div>
                    </div>
                    <div className="funds-container">
                        <div className="total-assets">
                            <div className="title">总资产</div>
                        </div>
                        <div className="total-assets-amount">{userInfo.totalScale}</div>
                        <div className="funds-list">
                            <div className="funds-item">
                                <div>持仓权益</div>
                                <div className="funds-amount">{userInfo.stockScale}</div>
                            </div>
                            <div className="funds-item">
                                <div>冻结资金</div>
                                <div className="funds-amount">{freezaFee}</div>
                            </div>
                            <div className="funds-item">
                                <div>可用资金</div>
                                <div className="funds-amount">{userInfo.ableScale}</div>
                            </div>
                            <div className="funds-item">
                                <div>实际可用</div>
                                <div className="funds-amount">{userInfo.limitAbleScale}</div>
                            </div>
                            <div className="funds-item">
                                <div>初期规模</div>
                                <div className="funds-amount">{userInfo.allottedScale}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="account-balance">
                    <div className="account-balance-top">
                        <div className="title">
                            <span>账户余额</span>
                            <span className="balance">{userInfo.balance}</span>
                        </div>
                        <div className="funds-operate">
                            <div>充值</div>
                            <div>提现</div>
                        </div>
                    </div>
                </div>
                <div className="lineline"></div>
                <div className="user-center-bottom">
                    <div className="box box1">
                        <div onClick={() => this.toWhere('/userdetail')}>
                            <img src={financingDetails} />
                            <div>个人详情</div>
                        </div>
                        <div>
                            <img src={capitalFlow} />
                            <div>资金流水</div>
                        </div>
                        <div>
                            <img src={bankCard} />
                            <div>银行卡修改</div>
                        </div >
                    </div >
                    <div className="box box2">
                        {allottedScale != 0 ? (
                            <div onClick={() => this.submit()}>
                                <img src={closeCase} />
                                <div>结案</div>
                            </div>
                        ) : ""}
                    </div>
                </div>
            </div>
        );
    }
}

export default usercenter;