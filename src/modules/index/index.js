//主页面，首页
import React from 'react';
//二维码
import QRCode from 'qrcode.react';
import httpAxios from '../../helpers/request';
//导航
import { MENU } from '../../constants/menudata'
//图
import b2 from './img/b2.png';
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
            qrUrl1: ''
        }
    }
    // componentWillMount()一般用的比较少，它更多的是在服务端渲染时使用。它代表的过程是组件已经经历了constructor()初始化数据后，但是还未渲染DOM时。
    componentWillMount = () => {

    }
    // 组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染
    componentDidMount = () => {
        let moren = this.props.location.pathname;
        this.setState({
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
    // 在此处完成组件的卸载和数据的销毁。
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    loginOut() {
        localStorage.clear();
        this.props.history.push('/login')
    }
    render() {
        let menuData = MENU;
        let menuDom = menuData.map((item, index) => (<Menu.Item key={item.key}>
            <Link to={item.path}><span>{item.name}</span></Link>
        </Menu.Item>));
        let menuData1, routeDom;
        menuData1 = menuData.map((item, index) => {
            if (item.path == '/index') {
                item.where = U
            } else if (item.path == '/plan') {
                item.where = plan
            } else if (item.path == '/withdrawal') {
                item.where = withdrawal
            } else if (item.path == '/topup') {
                item.where = topup
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
        </div>);
    }
}

export default MainContent;