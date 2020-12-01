//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
//md5
import alipay from './img/ali.png';
import bank from './img/bank.png';
class recharge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            money: "1000",
            list: [1000, 3000, 5000, 8000, 10000, 20000],
            inputMoney: "",
            payWayConfig: [],
            payType: 1,
            isWeiChat: true,
            visible: false,
            msg: ""
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        this.isWeiXin();
        this.getPayWay();
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

    getPayWay() {
        httpAxios('/tn/tntg/config/CTRL_PAY_CHANNEL', 'post', false, null).then(res => {
            let array = res['resultInfo'];
            array.forEach(element => {
                const data = {
                    index: 1,
                    name: '',
                    pic: '',
                    type: '',
                    fee: ''
                };
                data.type = element.type;
                data.fee = element.fee;
                switch (element.type) {
                    case 'bank':
                        data.name = '银行卡转账（线下）';
                        data.pic = 'bank';
                        data.index = 2;
                        break;
                    case 'alipay':
                        data.name = '支付宝支付（线下）';
                        data.pic = 'ali';
                        data.index = 3;
                        break;
                    case 'hongbo':
                        data.name = '第三方支付';
                        data.pic = 'yinlian';
                        data.index = 4;
                        break;
                }
                this.state.payWayConfig.push(data);
                this.setState({
                    payType: this.state.payWayConfig[0].index
                })
            });
        });
    }

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
    select(money) {
        this.setState({
            money: money,
            inputMoney: ""
        })
    }
    setMoney = e => {
        if (this.Decimal(Number(e.target.value)) <= 2 && Number(e.target.value) > 0 && Number(e.target.value) != null) {
            this.setState({
                money: e.target.value,
                inputMoney: e.target.value
            }, () => {

            })
        } else {
            this.setState({
                money: "",
                inputMoney: ""
            }, () => {

            })
        }

    }
    selectPayType(type) {
        console.log('是我', type);
        this.setState({
            payType: type
        })
    }
    Decimal(num) {
        num = num + '';
        if (num.indexOf('.') !== -1) {
            return num.split('.')[1].length;
        } else {
            return 0;
        }
    }

    isWeiXin() {
        const ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);
        if ((/MicroMessenger/i).test(ua)) {
            this.setState({
                isWeiChat: true
            })
        } else {
            this.setState({
                isWeiChat: false
            })
        }
    }
    // aliPay(moeny) {
    //     return this.http.post(this.host + `alipay/sign?totalAmount=${moeny}`, {},
    //         { headers: this.data.getPayHeader(), responseType: 'text' });
    // }
    pay() {
        console.log('我是钱', this.state.money, typeof (this.state.money), this.state.payType);
        if (this.Decimal(Number(this.state.money)) <= 2 && Number(this.state.money) > 0 && Number(this.state.money) != null) {
            console.log('没进这里')
            if (this.state.payType == 3) { // 支付宝支付
                if (this.state.isWeiChat) {
                    // _AP.pay(this.http.host + `/alipay/sign?totalAmount=${this.money}&token=${this.data.getToken()}`);
                } else {// 普通浏览器
                    // console.log(111);
                    // let options = {
                    //     totalAmount: this.state.money
                    // }
                    // httpAxios('/tn/alipay/sign', 'post', false, options).then(res => {
                    //     const div = document.createElement('div');
                    //     div.innerHTML = res;
                    //     document.body.appendChild(div);
                    //     document.forms[0].submit();
                    // });
                    //支付宝
                    localStorage.setItem("payType", this.state.payType);
                    localStorage.setItem("amount", this.state.money);
                    this.props.history.push('/bankcard');
                }
            } else if (this.state.payType == 2) { // 银行卡支付
                console.log(222);
                //银行卡
                localStorage.setItem("payType", this.state.payType);
                localStorage.setItem("amount", this.state.money);
                this.props.history.push('/bankcard');
            } else if (this.state.payType == 4) {
                console.log(333);
            }
        } else {
            console.log('进这里了')
            this.setState({
                visible: true,
                msg: '充值金额必须大于0，最多两位小数'
            });
        }
    }

    render() {
        const { isPc, money, inputMoney, list, payWayConfig, payType } = this.state;
        let listDom = list.map((item, index) => (
            <div key={index} className={money == item ? 'active-recharge' : ''} onClick={() => this.select(item)}>{item}元</div>
        ))
        let payWayConfigDom = payWayConfig.map((item, index) => (
            <div className="pay-way" onClick={() => this.selectPayType(item.index)} key={index}>
                {item.type == 'alipay' ? (<img src={alipay} alt="" />) : (<img src={bank} alt="" />)}
                <span>{item.name}</span>
                {item.fee != '' ? (<span className="red" >手续费{item.fee}</span>) : ""}
                <div className={payType == item.index ? 'radio' : 'radio radio-none'}></div>
            </div>
        ))
        return (
            <div>
                {/* <Modal
                    title="提示"
                    centered
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消">
                    <p>{this.state.msg}</p>
                </Modal> */}
                <Modal
                    title="提示"
                    centered
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[<Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>]}>
                    <p>{this.state.msg}</p>
                </Modal>
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">充值</p>
                </div>
                <div className="rechange">
                    <p className="title">
                        请选择充值金额
                    </p>
                    <div className="money-div">
                        {listDom}
                        <div style={{ width: "100%" }}>
                            {/* <Input type="number" placeholder="输入充值金额" value={this.state.inputMoney} onChange={e => this.setState({ inputMoney: e.target.value, money: e.target.value })} /> */}
                            <Input placeholder="输入充值金额" value={this.state.inputMoney} onChange={this.setMoney} />
                        </div>
                    </div>
                    {payWayConfigDom}
                    <div className="bottom-btn recharge-bottom" style={{ 'marginTop': "20px" }}>
                        <div className="main" onClick={() => this.pay()}>下一步</div>
                    </div>
                    <div className='text'>
                        <p>
                            【温馨提示】
    </p>
                        <p>
                            1、为了保障您的账户安全，首次充值前请完成实名认证绑定
    </p>
                        <p>
                            2、银行卡转账：可使用手机网银、电脑网银、银行柜台或ATM机转账等方式，因手机网银限额问题，当日转账大于5万时，请使用电脑网银U盾。 操作流程：提交充值→复制收款方银行卡号及备注等信息→完成线下转账→等待审核到账
    </p>
                        <p>
                            3、支付宝转账：单笔限额5万
    </p>
                        <p>
                            操作流程：提交充值→复制收款方支付宝账号及备注等信息→完成线下转账→等待审核到账
    </p>
                        <p>
                            4、说明：提交充值后请尽快完成转账，系统将在10分钟内完成审核，超时未完成请重新发起即可
    </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default recharge;