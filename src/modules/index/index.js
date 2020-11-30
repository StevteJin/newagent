//主页面，首页
import React from 'react';
//二维码
import QRCode from 'qrcode.react';
import httpAxios from '../../helpers/request';
//导航
import { MENU } from '../../constants/menudata'
//图
import b2 from './img/b2.png';
import index from './img/index.png';
import gerem from './img/gerem.png';
//引入表格，布局，导航
import { Layout, Menu } from 'antd';
import { Link, Route, Redirect, Switch } from 'react-router-dom';

//引入路由页面
//主页
import U from '../user/index';
import A from '../list/index';
import plan from '../plans/index';
import withdrawal from '../withdrawal/index';
import topup from '../topup/index';
import mIndex from '../mIndex/index';
import deposit from '../deposit/index';
import strategy from '../strategy/index';
import usercenter from '../usercenter/index';
import userdetail from '../userdetail/index';
import capitalflow from '../capitalflow/index';
import card from '../card/index';
import recharge from '../recharge/index';
import bankcard from '../bankcard/index';
import tixian from '../tixian/index';
import transfer from '../transfer/index';
import ercode from '../ercode/index';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
import { ORIGIN } from '../../constants/index'
const { Content, Sider } = Layout;
class MainContent extends React.Component {
    /*constructor()中完成了React数据的初始化，它接受两个参数：props和context，当想在函数内部使用这两个参数时，需使用super()传入这两个参数。
注意：只要使用了constructor()就必须写super(),否则会导致this指向错误。*/
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            theme: "dark",
            current: "",
            username: '',
            qrUrl: '',
            qrUrl1: '',
            isPc: false,
            where: "/plan",
            path: "",
            tiao: false
        }
    }
    // componentWillMount()一般用的比较少，它更多的是在服务端渲染时使用。它代表的过程是组件已经经历了constructor()初始化数据后，但是还未渲染DOM时。
    componentWillMount = () => {

    }
    box = () => {
        this.browserRedirect();
    }
    // 组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染
    componentDidMount = () => {
        this.isiPhone();
        let path = this.props.location.pathname;
        console.log('我是当前路由', path);
        this.setState({
            where: path
        })
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        let moren = this.props.location.pathname;
        this.setState({
            path: path,
            current: moren.substring(moren.lastIndexOf("/") + 1, moren.lenth)
        });
        this.props.history.listen((event) => {
            let test = event.pathname;
            let text = test.substring(test.lastIndexOf("/") + 1, test.length);
            this.setState({
                current: text
            });
        })
        let invite_code_desc = `${ORIGIN}` + '/h5tncl/' + localStorage.getItem('uri') || "";
        let referral_code_desc = localStorage.getItem('referral_code_desc') || "";
        let username = localStorage.getItem('username');
        this.setState({
            qrUrl: invite_code_desc,
            qrUrl1: referral_code_desc,
            username: username
        }, () => {
            console.log('图啊', this.state.username, this.state.invite_code_desc)
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
    // 在此处完成组件的卸载和数据的销毁。
    componentWillUnmount = () => {
        let that = this;
        window.removeEventListener('resize', that.box);
        this.setState = (state, callback) => {
            return;
        };
    }
    loginOut() {
        localStorage.clear();
        this.props.history.push('/login')
    }

    toWhere(who) {
        this.setState({
            where: who
        }, () => {
            this.props.history.push(this.state.where);
        })
    }

    isiPhone() {
        let isIphoneX = (() => {
            if (typeof window !== 'undefined' && window) {
                // console.log('userAgent>>',window.navigator.userAgent)
                return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
            }
            return false;
        })();

        if (isIphoneX) {
            this.setState({
                tiao: true
            })
        }

        function testUA(str) {

            return navigator.userAgent.indexOf(str) > -1

        }
    }

    render() {
        const { isPc, where, path, tiao } = this.state;
        let menuData = MENU;
        let menuDom = menuData.map((item, index) => (<Menu.Item key={item.key}>
            <Link to={item.path}><span>{item.name}</span></Link>
        </Menu.Item>));
        let menuData1, routeDom;
        menuData1 = menuData.map((item, index) => {
            if (item.path == '/index') {
                if (isPc) {
                    item.where = U
                } else {
                    item.where = usercenter
                }
            } else if (item.path == '/plan') {
                if (isPc) {
                    item.where = plan
                } else {
                    item.where = mIndex
                }
            } else if (item.path == '/withdrawal') {
                if (isPc) {
                    item.where = withdrawal
                } else {
                    item.where = tixian
                }
            } else if (item.path == '/tixian') {
                if (isPc) {
                    item.where = withdrawal
                } else {
                    item.where = tixian
                }
            } else if (item.path == '/transfer') {
                if (isPc) {
                    item.where = withdrawal
                } else {
                    item.where = transfer
                }
            } else if (item.path == '/topup') {
                if (isPc) {
                    item.where = topup
                } else {
                    item.where = recharge
                }
            } else if (item.path == '/recharge') {
                if (isPc) {
                    item.where = topup
                } else {
                    item.where = recharge
                }
            } else if (item.path == '/deposit/:id') {
                if (isPc) {
                    item.where = plan
                } else {
                    item.where = deposit
                }
            } else if (item.path == '/strategy/:id') {
                if (isPc) {
                    item.where = plan
                } else {
                    item.where = strategy
                }
            } else if (item.path == '/usercenter') {
                if (isPc) {
                    item.where = U
                } else {
                    item.where = usercenter
                }
            } else if (item.path == '/userdetail') {
                if (isPc) {
                    item.where = U
                } else {
                    item.where = userdetail
                }
            } else if (item.path == '/capitalflow') {
                if (isPc) {
                    item.where = A
                } else {
                    item.where = capitalflow
                }
            } else if (item.path == '/bankcard') {
                if (isPc) {
                    item.where = topup
                } else {
                    item.where = bankcard
                }
            } else if (item.path == '/card/:id') {
                if (isPc) {
                    item.where = withdrawal
                } else {
                    item.where = card
                }
            } else if (item.path == '/ercode') {
                item.where = ercode
            } else {
                item.where = A
            }
            return item;
        })
        console.log('数组1', menuData1)
        let token = localStorage.getItem('token');
        routeDom = menuData1.map((item, index) => (
            token ? (<Route exact path={item.path} component={item.where} key={item.key} />) : (<Redirect
                to={{
                    pathname: "/login"
                }}
            />)
        ))
        return (<div>
            {isPc ? (
                <div>
                    <Layout>
                        <div className="topTitle">
                            <span className="s1">资管后台管理系统</span>
                            <span className="s2"><span className='us'>HELLO</span>,<img src={b2} alt="" />
                                <span className='us'>{this.state.username}</span>{this.state.username ? <span className='loginout' onClick={() => this.loginOut()}>退出</span> : ''}</span>
                        </div>
                        <Layout>
                            <Sider width={200} style={{ background: '#fff' }}>
                                <div className="username">{this.state.username}</div>
                                <div className='menuBox'>
                                    <Menu
                                        mode="inline"
                                        selectedKeys={[this.state.current]}
                                        style={{ height: '100%' }}
                                    >
                                        {menuDom}
                                    </Menu>
                                </div>
                                {this.state.qrUrl1 ?
                                    <div className='ercode'>
                                        <div className='ertitle'>我的推广码</div>
                                        <div className='erimg'>
                                            <QRCode
                                                value={this.state.qrUrl1}
                                                size={110}
                                                fgColor="#000000"
                                            />
                                        </div>
                                    </div> : <div className='ercode'>
                                        <div className='ertitle'>我的邀请码</div>
                                        <div className='erimg'>
                                            <QRCode
                                                value={this.state.qrUrl}
                                                size={110}
                                                fgColor="#000000"
                                            />
                                        </div>
                                    </div>}
                            </Sider>
                            <Layout>
                                <Content
                                    style={{
                                        background: '#fff',
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                    }}
                                >
                                    <Switch>
                                        {routeDom}
                                    </Switch>
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </div>
            ) : (
                    <div>
                        {routeDom}
                        {tiao==true?(<div class="fix-iphonex-bottom"></div>):""}
                        {path == '/plan' || path == '/mIndex' || path == '/usercenter' ? (
                            <div className="footer1" id="footer1">
                                <div className="small-footer">
                                    <div className={where == "/plan" ? "footer-div icon-active" : "footer-div"} onClick={() => this.toWhere('/plan')}>
                                        <div className="icon index"></div>
                                        <p>首页</p>
                                    </div>
                                    <div className={where == "/usercenter" ? "footer-div icon-active" : "footer-div"} onClick={() => this.toWhere('/usercenter')}>
                                        <div className="icon geren"></div>
                                        <p>个人</p>
                                    </div>
                                </div>
                            </div>
                        ) : ""}

                    </div>
                )}
        </div>);
    }
}

export default MainContent;