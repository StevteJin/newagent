//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import QRCode from 'qrcode.react';

console.log(httpAxios)
class bankcard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            payType: "",
            cardInfro: { 'bankAccountName': '', 'bankCardNo': '', 'bankName': '', bankBranch: '', aliyPay: '', aliyPayName: '', aliyPayCodeUrl: '' },
            amount: "",
            remark: "",
            userName: "",
            qrUrl: "",
            visible: false,
            msg: ""
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        let payType = localStorage.getItem("payType");
        let amount = localStorage.getItem("amount");
        let userName = localStorage.getItem("username");
        this.setState({
            payType: payType,
            amount: amount,
            userName: userName
        }, () => {
            this.getPayCardInfo();
        })
    }
    componentWillUnmount = () => {
        let that = this;
        window.removeEventListener('resize', that.box);
        this.setState = (state, callback) => {
            return;
        };
    }

    box = () => {
        this.browserRedirect();
    }


    handleOk = e => {
        console.log(e);
        if (this.state.msg == '请重新登录') {
            this.props.history.push('/login');
        }
        if (this.state.msg == '充值已提交，请尽快充值，等待后台审核') {
            this.props.history.push('/usercenter');
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

    getPayCardInfo() {
        httpAxios('/tn/tntg/payCardInfo', 'post', false, null).then(res => {
            let remark = `用户：${this.state.userName} 充值 ${this.state.amount} 元`;
            let qrUrl = 'https://' + this.state.cardInfro.aliyPayCodeUrl.split('//')[1]
            this.setState({
                cardInfro: res,
                remark: remark,
                qrUrl: qrUrl
            })
        });
    }
    back() {
        this.props.history.push('/recharge');
    }
    copy1(text) {

    }
    pay() {
        let data = {
            totalAmount: this.state.amount
        }
        let type;
        if (this.state.payType == 2) {
            type = 'BANK'
        } else {
            type = 'ALIPAY'
        }
        httpAxios('/tn/tntg/submitBankTrans/' + type, 'post', false, data).then(res => {
            this.setState({
                visible: true,
                msg: "充值已提交，请尽快充值，等待后台审核"
            }, () => {

            });
        });
    }
    render() {
        const { isPc, payType, cardInfro, amount, remark, qrUrl } = this.state;
        return (
            <div>
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
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">充值信息确认</p>
                </div>
                <div className="cell-list">
                    {payType == 3 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                支付宝账号
                    </span>
                            <span className="list-item-content">
                                {cardInfro.aliyPay}
                                {/* <a onClick={() => this.copy1(cardInfro.aliyPay)} className="copy">复制</a> */}
                            </span>
                        </div>
                    ) : ""}
                    {payType == 3 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                收款人姓名
                        </span>
                            <span className="list-item-content">
                                {cardInfro.aliyPayName}
                                {/* <a onClick={() => this.copy1(cardInfro.aliyPayName)} className="copy">复制</a> */}
                            </span>
                        </div>
                    ) : ""}
                    {payType == 2 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                收款银行
                    </span>
                            <span className="list-item-content">
                                {cardInfro.bankName}
                            </span>
                        </div>
                    ) : ""}
                    {payType == 2 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                收款人姓名
    </span>
                            <span className="list-item-content">
                                {cardInfro.bankAccountName}
                                {/* <a onClick={() => this.copy1(cardInfro.bankAccountName)} className="copy">复制</a> */}
                            </span>
                        </div>
                    ) : ""}
                    {payType == 2 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                收款账号
    </span>
                            <span className="list-item-content">
                                {cardInfro.bankCardNo}
                                {/* <a onClick={() => this.copy1(cardInfro.bankCardNo)} className="copy">复制</a> */}
                            </span>
                        </div>
                    ) : ""}
                    {payType == 2 ? (
                        <div className="list-item">
                            <span className="list-item-name">
                                开户行
    </span>
                            <span className="list-item-content">
                                {cardInfro.bankBranch}
                            </span>
                        </div>
                    ) : ""}


                    <div className="list-item">
                        <span className="span-title">
                            充值金额
    </span>
                        <span className="list-item-content">
                            {amount}
                        </span>
                    </div>
                    {payType == 3 ? (
                        <div className="list-item" style={{ height: "130px", overflow: "hidden" }}>
                            <span className="span-title" style={{ display: "inline-block", float: "left" }}>支付宝收款码</span>
                            <span className="lsit-item-content" style={{ display: "inline-block", float: "right", "marginTop": "20px" }}>
                                <div style={{ "textAlign": "center", width: "90px", height: "90px", "marginRight": "20px", "overflow": "hidden" }}>
                                    <QRCode
                                        value={qrUrl}
                                        size={90}
                                        fgColor="#000000"
                                    />
                                </div>
                            </span>
                        </div>
                    ) : ""}

                    <div className="list-item" style={{ height: "auto", overflow: "hidden" }}>
                        <span className="span-title" style={{ margin: "auto 15px" }}>
                            备注
    </span>
                        <span className="list-item-content" style={{ width: "200px", marginTop: "10px", lineHeight: "2", "textAlign": "right", "fontSize": ".9rem" }}>
                            {remark}
                        </span>
                    </div>
                </div>
                <div className="bottom-btn" style={{ "marginTop": "20px" }}>
                    <div className="main" onClick={() => this.pay()}>去转账</div>
                </div>
            </div>
        );
    }
}

export default bankcard;