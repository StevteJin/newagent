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
import md5 from 'js-md5';
import m1 from './img/m11.png';
import m2 from './img/m2.png';
import m3 from './img/m3.png';
import m4 from './img/m4.png';
import m5 from './img/m5.png';
console.log(httpAxios)
class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // username: '100001210',
            // password: '001210',
            username: '',
            password: '',
            visible: false,
            msg: '',
            loadingTime: 10,
            isLogin: false,
            isPc: false
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
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
    loginNow() {
        let options = {
            username: this.state.username,
            password: md5(this.state.password)
        };
        httpAxios('/tn/tntg/login', 'post', false, options).then(res => {
            console.log(res);
            if (res.success == true) {
                let resultInfo = res.resultInfo;
                localStorage.setItem('token', resultInfo.token);
                localStorage.setItem('is_agent', resultInfo.is_agent);
                localStorage.setItem('uri', resultInfo.uri);
                localStorage.setItem('username', this.state.username);
                var num = 10;
                let that = this;
                var t = setInterval(function () {
                    num = num + 10;
                    if (num == 100) {
                        clearInterval(t);
                    }
                    that.setState({
                        loadingTime: num
                    }, () => {
                    });
                    if (num > 90) {
                        that.props.history.push('/index');
                    }
                }, 100);
            } else {

            }
        }, error => {
            console.log(error.response)
            if (error.response.status == 400) {
                let data = JSON.stringify(error.response.data.resultInfo);
                data = data.replace(/^(\s|")+|(\s|")+$/g, '');
                this.setState({
                    visible: true,
                    msg: data
                })
            }
        });
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

    render() {
        const { isPc } = this.state;
        return (
            <div>{isPc ? (
                <div>
                    <Modal
                        title="提示"
                        centered
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确定"
                        cancelText="取消"
                    >
                        <p>{this.state.msg}</p>
                    </Modal>
                    <div className="biglogin">
                        <div className="leftLogin">
                            <div className="topLogin">
                                <div className="t1">
                                    <span>资管后台管理系统</span>&nbsp;
                                <img src={m2} alt="" />
                                </div>
                                <div className="t2">科技改变金融</div>
                                {/* <img className="t3" src={m3} alt="" /> */}
                            </div>
                            <div className="bottomLogin">
                                {/* <div className="b1">
                                <img src={m4} alt="" />
                                <span>仁信</span>
                            </div> */}
                                <div className="loading">
                                    {this.state.loadingTime == 10 ? <div className="bbba">Not logged in</div> :
                                        <div className="bbba">Loading is running in the background...</div>}
                                    <Progress percent={this.state.loadingTime} showInfo={false} strokeColor='#5473FF' width='2' />
                                </div>
                            </div>
                        </div>
                        <div className="loginbox">
                            <div className="title">登录</div>
                            <Input className="in1" placeholder="用户账号" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                            <Input type="password" className="in2" placeholder="用户密码" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} /><br /><br />
                            <div className="mbox">
                                <img className="m5" src={m5} alt="" />
                                <Button className="loginButton" type="primary" onClick={() => this.loginNow()}>登录</Button>
                            </div>
                        </div>
                    </div>
                </div>) : (
                    <div className="login-div">
                        <div className="input-div">
                            <p className="title">欢迎登录</p>
                            <p className="smalltitle">Welcome to login</p>
                            <div className="login-input">
                                <input type="text" placeholder="请输入账号" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                            </div>
                            <div className="login-input">
                                <input type="password" placeholder="请输入密码" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                            </div>
                            <button className="login-btn" onClick={() => this.loginNow()}>登录</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default login;