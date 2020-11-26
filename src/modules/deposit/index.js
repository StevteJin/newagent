//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import search from './img/strategy_search.png';

console.log(httpAxios)
class deposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goId: "",
            typeList: [{
                id: 0,
                num: 'NO.1',
                date: '日',
                money: '3',
                text: '天天赢',
                class: 'tty',
                amount: 1000
            }],
            nameMsg: "",
            data: [],
            staticData: [],
            detail: [],
            mulType: "",
            tabs: 0,
            money: 1000,
            allottedScale: ""
        }
    }
    componentDidMount = () => {
        console.log('接收的', this.props.match.params.id);
        let goId = this.props.match.params.id;
        this.setState({
            goId: goId
        });
        this.getPerson();
    }
    componentWillUnmount = () => {

    }

    getPerson() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                userInfo: res
            }, () => {
                this.setState({
                    allottedScale: this.state.userInfo.allottedScale
                })
                this.financeScheme();
            });
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

    back() {
        this.props.history.push('/plan');
    }
    selectType(id, money) {

    }
    finance() {
        this.state.detail = [];

        this.state.financeData.sort((a, b) => {
            return b['financeRatio'] - a['financeRatio'];
        });
        this.state.financeData.forEach((element, index) => {
            this.state.detail.push({ id: index, mul: element['financeRatio'], financeFeeRate: element['financeFeeRate'], makeFeeRate: element['makeFeeRate'] });
        });
        this.setState({
            mulType: this.state.detail[0].mul
        })
    }
    financeScheme() {
        let goId = this.props.match.params.id;
        httpAxios('/tn/tntg/financeScheme', 'post', false, null).then(res => {
            const data = {
                id: 0,
                mul: 1
            };
            this.setState({
                staticData: res['resultInfo']
            }, () => {
                if (goId == 0) {
                    console.log('6666688888888888');
                    this.setState({
                        financeData: this.state.staticData['day'],
                        nameMsg: '按使用金额收取固定收益'
                    }, () => {
                        this.finance();
                        if (this.state.userInfo.allottedScale == 0) {
                            this.setState({
                                mulType: this.state.detail[0].mul
                            })
                        } else {
                            this.setState({
                                mulType: this.state.userInfo.financeRatio
                            })
                        }
                    })
                } else if (goId == 1) {
                    this.setState({
                        financeData: this.state.staticData['week']
                    }, () => {
                        this.finance();
                        if (this.state.userInfo.allottedScale == 0) {
                            this.setState({
                                mulType: this.state.detail[0].mul
                            })
                        } else {
                            this.setState({
                                mulType: this.state.userInfo.financeRatio
                            })
                        }
                    })
                } else if (goId == 2) {
                    this.setState({
                        financeData: this.state.staticData['month'],
                        nameMsg: '按申请金额收取固定收益'
                    }, () => {
                        this.finance();
                        if (this.state.userInfo.allottedScale == 0) {
                            this.setState({
                                mulType: this.state.detail[0].mul
                            })
                        } else {
                            this.setState({
                                mulType: this.state.userInfo.financeRatio
                            })
                        }
                    })
                } else {
                    this.setState({
                        financeData: this.state.staticData['single'],
                        nameMsg: '按个股盈利分成'
                    }, () => {
                        this.finance();
                        if (this.state.userInfo.allottedScale == 0) {
                            this.setState({
                                mulType: this.state.detail[0].mul
                            })
                        } else {
                            this.setState({
                                mulType: this.state.userInfo.financeRatio
                            })
                        }
                    })
                }
            })


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

    changeTabs(tabs) {
        this.setState({
            tabs: tabs
        })
    }
    goto(id, mul, financeFeeRate) {

    }
    add(val) {

    }
    render() {
        const { typeList, nameMsg, detail, userInfo, mulType, tabs, allottedScale } = this.state;
        let typeListDom = typeList.map((item, index) => (
            <div key={index} onClick={() => this.selectType(item.id, item.money)} className="tabsActive">
                <div className="num"></div><br />
                <div className="interest">{nameMsg}</div>
                <div className="amount-num">{item.amount}元起</div>
            </div>
        ));
        let detailDom = detail.map((item, index) => (
            <div key={index}>
                <div onClick={() => this.goto(item.id, item.mul, item.financeFeeRate)} className={mulType == item.mul ? 'multiple-item multiple-active' : 'multiple-item'}>
                    <div className="title">放大倍数</div>
                    <span className="multiple-box">{item.mul}
                        <span className="several-times">&nbsp;倍</span>
                    </span>
                    <p style={{ marginTop: "50px" }} >{((item.mul * this.state.money) / 10000).toFixed(2)}
                        <span className="multiple-unit">万元</span>
                    </p>
                    <img src={search} className="strategy-search" />
                </div>
            </div>
        ))
        return (
            <div>
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">策略</p>
                </div>
                <div className="strategy-tabs">
                    {typeListDom}
                </div>
                <div className="zixuan-content">
                    <div className="tabs2">
                        <div onClick={() => this.changeTabs(0)} className={tabs == 0 ? 'tabs2-active' : ''}>申请操盘</div>
                        <div onClick={() => this.changeTabs(1)} className={tabs == 1 ? 'tabs2-active' : ''}>我的持仓</div>
                    </div>
                    {tabs == 0 ? (
                        <div className='tab-content'>
                            <div className="money">
                                <p className="tou">投入本金</p>
                                <input type="number" value={this.state.money} onChange={e => this.setState({ money: e.target.value })} />
                            </div>
                            {allottedScale != 0 ? (
                                <div className='flex-btn'>
                                    <button onClick={() => this.add(true)}>加配</button>
                                    <button onClick={() => this.add(false)}> 补仓</button>
                                </div>
                            ) : ""}
                            <div className='multiple-div'>
                                {detailDom}
                            </div>
                        </div>
                    ) : ""}
                    {tabs == 1 ? (
                        <div className='tab-content'>

                        </div>
                    ) : ""}

                </div>
            </div >
        );
    }
}

export default deposit;