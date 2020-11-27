//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';



class transfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            backableScale: "",
            liftScale: "",
            visible: false,
            msg: ""
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        let backableScale = localStorage.getItem('balance') || 0;
        this.setState({
            backableScale: backableScale
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
        this.props.history.push('/tixian');
    }
    goto(where) {
        this.props.history.push(where);
    }
    Decimal(num) {
        num = num + '';
        if (num.indexOf('.') !== -1) {
            return num.split('.')[1].length;
        } else {
            return 0;
        }
    }
    withdraw() {
        if (this.state.liftScale === '' || parseFloat(this.state.liftScale) <= 0 || this.Decimal(this.state.liftScale) > 2) {
            this.setState({
                visible: true,
                msg: "提现金额必须大于0，最多两位小数"
            });
        } else if (this.state.liftScale > this.state.backableScale) {
            this.setState({
                visible: true,
                msg: "提现金额不能大于余额"
            });
        } else {
            const data = {
                liftScale: this.state.liftScale
            };
            httpAxios('/tn/tntg/lift', 'post', false, data).then(res => {
                this.setState({
                    visible: true,
                    msg: "提现申请已提交"
                });
                this.props.history.push('/usercenter');
            });
        }
    }

    render() {
        const { isPc, backableScale } = this.state;
        return (
            <div className="huibg">
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
                    <p className="navigation-title">人民币提现</p>
                </div>
                <div className="cell-list">
                    <div className="list-item">
                        <span className="span-title">
                            提现金额
    </span>
                        <Input type="number" placeholder="请输入提现金额" value={this.state.liftScale} onChange={e => this.setState({ liftScale: e.target.value })} />
                    </div>
                </div>
                <p className="tips">
                    <span>
                        账户余额：{backableScale} 元
  </span>
                    <span>
                    </span>
                </p>

                <div className="bottom-btn" style={{ 'marginTop': '20px' }}>
                    <div className="main" onClick={() => this.withdraw()}>申请提取</div>
                </div>
            </div>
        );
    }
}

export default transfer;