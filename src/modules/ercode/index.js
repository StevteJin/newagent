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


class ercode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            backableScale: "",
            qrUrl: ""
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        let qrUrl = 'http://47.102.151.13//h5tncl/' + localStorage.getItem('uri');
        this.setState({
            qrUrl: qrUrl
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
        this.props.history.push('/usercenter');
    }
    goto(where) {
        this.props.history.push(where);
    }
    render() {
        const { isPc, qrUrl } = this.state;
        return (
            <div className="huibg">
                <div className="navigation">
                    <div className="back" onClick={() => this.back()} ></div>
                    <p className="navigation-title">推广二维码</p>
                </div>
                <div>
                    <div className="ercode">
                        <QRCode
                            value={qrUrl}
                            size={200}
                            fgColor="#000000"
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default ercode;