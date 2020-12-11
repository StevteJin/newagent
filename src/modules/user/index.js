//此为主页
import React from 'react';
import b1 from './img/b1.png';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import { Modal,Button } from 'antd';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getPerson();
    }
    getPerson() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                totalScale: res.totalScale,
                accountCode: res.accountCode,
                accountName: res.accountName,
                balance: res.balance,
                stockScale: res.stockScale,
                freezeScale: res.freezeScale,
                ableScale: res.ableScale,
                limitAbleScale: res.limitAbleScale,
                allottedScale: res.allottedScale
            });
            console.log('我是信息', this.state);
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
    chongzhi() {
        this.props.history.push('/topup');
    }
    tixian() {
        this.props.history.push('/withdrawal');
    }
    jiean() {
        let url = '/tn/tntg/Strategy', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            if (res.success == true) {
                this.setState({
                    visible: true,
                    msg: '结案成功'
                })
                this.getPerson();
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

    username(username) {
        //store.dispatch（）是View发出Action的唯一方法。携带一个Action对象作为参数，将它发送出去。
        store.dispatch({
            type: 'username',
            payload: username
        })
    }
    render() {
        const { totalScale, accountName, accountCode, balance, stockScale, freezeScale, ableScale, limitAbleScale, allottedScale } = this.state;
        return (
            /**
             * dataSource为数据数组
             * columns为表格的描述配置，列明什么之类的
             */
            <div className="usercenter">
                {/* <Modal
                    title="提示"
                    centered
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
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
                {/* <div>
                    <button onClick={this.decrement}>-</button>
                    {this.state.count}
                    <button onClick={this.increment}>+</button>
                </div> */}
                <div className="topuser">
                    <img className="u1 img" src={b1} alt="" />
                    <div className="u1">
                        <div className="t1">{accountName}</div>
                        <div className="t2">{accountCode}</div>
                    </div>
                    <div className="u1">
                        <span className='s1'>总资产 :</span>
                        <span className='s2'>{totalScale}</span>
                    </div>
                    <div className="r3">
                        <span className="rr1" onClick={() => this.chongzhi()}>充值</span>
                        <span className="rr2">/</span>
                        <span className="rr3" onClick={() => this.tixian()}>提现</span>
                        {allottedScale != 0 ? (<span className="rr2">/</span>) : ''}
                        {allottedScale != 0 ? (<span className="rr3" onClick={() => this.jiean()}>结案</span>) : ''}
                    </div>
                    {/* <div className="u1">
                        <div className="level">上级用户</div>
                        <div className="level1">已实名</div>
                    </div> */}
                </div>
                <div className="bottomuser">
                    <div className="userbox">
                        <div className="b1">账户余额</div>
                        <div className="b2">ACCOUNT BALANCE</div>
                        <div className="b3">{balance}</div>
                    </div>
                    <div className="userbox">
                        <div className="b1">持仓权益</div>
                        <div className="b2">POSITION RIGHTS</div>
                        <div className="b3">{stockScale}</div>
                    </div>
                    <div className="userbox">
                        <div className="b1">冻结资金</div>
                        <div className="b2">FREEZE FUNDS</div>
                        <div className="b3">{freezeScale}</div>
                    </div>
                    <div className="userbox">
                        <div className="b1">可用资金</div>
                        <div className="b2">AVAILABLE FUNDS</div>
                        <div className="b3">{ableScale}</div>
                    </div>
                    <div className="userbox">
                        <div className="b1">实际可用</div>
                        <div className="b2"> ACTUAL AVAILABLE</div>
                        <div className="b3">{limitAbleScale}</div>
                    </div>
                    <div className="userbox">
                        <div className="b1">初期规模</div>
                        <div className="b2">INITIAL SIZE</div>
                        <div className="b3">{allottedScale}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;