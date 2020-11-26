//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import banner4 from './img/banner4.png';
import wenhao from './img/wenhao.png';
import right from './img/right.png';

console.log(httpAxios)
class strategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goId: "",
            info: {
                bzj: 1000,
                cpje: 5000,
                fwf: '0',
                jjje: 4600,
                tradeDay: "",
                zsje: 4400
            },
            tradeDay: "",
            isAdd: "",
            makeFeeRate: "",
            financeFee: "",
            manageFee: "",
            strategyType: "",
            separateFeeRate: "",
            peiziData: "",
            financeData: "",
            dateText: "",
            dayType: ['day', 'week', 'month', 'single'],
            chicangShow: false,
            positionRatio: "",
            secondBoardPositionRatio: ""
        }
    }
    componentDidMount = () => {
        let goId = this.props.match.params.id;
        let isAdd = localStorage.getItem("isAdd");
        let peiziData = JSON.parse(localStorage.getItem("strategyData"));
        let strategyType = peiziData.type;
        let tradeDay = this.getNowFormatDate();
        this.setState({
            goId: goId,
            isAdd: isAdd,
            peiziData: peiziData,
            strategyType: strategyType,
            tradeDay: tradeDay,
            positionRatio: peiziData.positionRatio,
            secondBoardPositionRatio: peiziData.secondBoardPositionRatio
        }, () => {
            if (this.state.isAdd == true) {
                let url = '/tn/tntg/userInfo', method = 'post', options = null;
                httpAxios(url, method, false, options).then(res => {
                    let separateFeeRate = res['separateFeeRate'];
                    let fwf = (Math.round(res['manageMakeFeeRate'] * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                    this.setState({
                        separateFeeRate: separateFeeRate
                    })
                    this.state.info.fwf = fwf;
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
            } else {
                let url = '/tn/tntg/financeScheme', method = 'post', options = null;
                httpAxios(url, method, false, options).then(res => {
                    if (this.state.peiziData.type == 0) {
                        this.setState({
                            financeData: res['resultInfo']['day']
                        }, () => {
                            this.state.financeData.forEach(element => {
                                if (element['financeRatio'] == this.state.peiziData.mulType) {
                                    this.setState({
                                        financeFee: element['financeFeeRate'],
                                        makeFeeRate: element['makeFeeRate'],
                                        separateFeeRate: element['separateFeeRate']
                                    }, () => {
                                        let fwf = (Math.round(this.state.makeFeeRate * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                                        console.log('我建仓费', this.state.makeFeeRate, '707', this.state.peiziData.mulType, '808', this.state.peiziData.money);
                                        this.state.info.fwf = fwf;
                                    })
                                }
                            });
                        })
                    } else if (this.state.peiziData.type == 1) {
                        this.setState({
                            financeData: res['resultInfo']['week']
                        }, () => {
                            this.state.financeData.forEach(element => {
                                if (element['financeRatio'] == this.state.peiziData.mulType) {
                                    this.setState({
                                        financeFee: element['financeFeeRate'],
                                        makeFeeRate: element['makeFeeRate'],
                                        separateFeeRate: element['separateFeeRate']
                                    }, () => {
                                        let fwf = (Math.round(this.state.makeFeeRate * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                                        this.state.info.fwf = fwf;
                                    })
                                }
                            });
                        })
                    } else if (this.state.peiziData.type == 2) {
                        this.setState({
                            financeData: res['resultInfo']['month']
                        }, () => {
                            this.state.financeData.forEach(element => {
                                if (element['financeRatio'] == this.state.peiziData.mulType) {
                                    this.setState({
                                        financeFee: element['financeFeeRate'],
                                        makeFeeRate: element['makeFeeRate'],
                                        separateFeeRate: element['separateFeeRate']
                                    }, () => {
                                        let fwf = (Math.round(this.state.makeFeeRate * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                                        this.state.info.fwf = fwf;
                                    })
                                }
                            });
                        })
                    } else {
                        this.setState({
                            financeData: res['resultInfo']['single']
                        }, () => {
                            this.state.financeData.forEach(element => {
                                if (element['financeRatio'] == this.state.peiziData.mulType) {
                                    this.setState({
                                        financeFee: element['financeFeeRate'],
                                        makeFeeRate: element['makeFeeRate'],
                                        separateFeeRate: element['separateFeeRate']
                                    }, () => {
                                        let fwf = (Math.round(this.state.makeFeeRate * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                                        this.state.info.fwf = fwf;
                                    })
                                }
                            });
                        })
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

            this.state.info.bzj = this.state.peiziData.money;
            this.state.info.cpje = this.state.peiziData.money * (this.state.peiziData.mulType + 1) + parseInt(localStorage.getItem('allottedScale2'), 0);
            this.setState({
                dateText: this.state.dayType[this.state.strategyType]
            }, () => {
                const manageFee = {
                    financeRatio: this.state.peiziData.mulType,
                    financePeriod: this.state.dateText,
                    amount: this.state.peiziData.money
                };

                let url = '/tn/tntg/theManageFee', method = 'post', options = manageFee;
                httpAxios(url, method, false, options).then(res2 => {
                    this.setState({
                        manageFee: res2['resultInfo']['amount']
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
            })
            this.state.info.jjje = this.state.info.cpje * this.state.peiziData.cordonLineRate;
            this.state.info.zsje = this.state.info.cpje * this.state.peiziData.flatLineRate;
        });

    }
    componentWillUnmount = () => {

    }

    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    back() {
        this.props.history.push('/deposit/' + this.state.goId);
    }
    alert(num) {

    }
    chicang() {
        this.setState({
            chicangShow: true
        })
    }
    chino() {
        this.setState({
            chicangShow: false
        })
    }
    submit() {

    }
    render() {
        const { goId, info, isAdd, makeFeeRate, financeFee, manageFee, strategyType, separateFeeRate, tradeDay, chicangShow, positionRatio, secondBoardPositionRatio } = this.state;
        return (
            <div>
                {chicangShow == true ? (
                    <div className="chicang">
                        <div className="chibox">
                            <div className="chititle">单股持仓</div>
                            <div className="chibox1">
                                <div className="chi chileft">
                                    <div className="chi1">个股持仓比例</div>
                                    <div className="chi2">{positionRatio}</div>
                                </div>
                                <div className="chi chiright">
                                    <div className="chi1">创业板持仓比例</div>
                                    <div className="chi2">{secondBoardPositionRatio}</div>
                                </div>
                            </div>
                            <div className="chiknow" onClick={() => this.chino()}>我知道了</div>
                        </div>
                    </div>
                ) : ""}

                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">策略</p>
                </div>
                <div>
                    <div className="banner">
                        <p>操盘资金</p>
                        <p>{info.cpje}.00</p>
                        <img src={banner4} alt="" />
                    </div>
                    <div className="content">
                        <div className="cell-list">
                            <div className="list-item">
                                <span className="list-item-name">
                                    {isAdd == 'true' ? "新增" : ""}保证金
                                </span>
                                <span className="list-item-content">
                                    {info.bzj}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    建仓费
                                </span>
                                <span className="list-item-content">
                                    {info.fwf}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    建仓费率
                                </span>
                                <span className="list-item-content">
                                    {makeFeeRate}
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    管理费率
                                </span>
                                <span className="list-item-content">
                                    {financeFee}
                                </span>
                            </div>
                            {strategyType != 0 ? (
                                <div className="list-item">
                                    <span className="list-item-name">
                                        本{strategyType == 1 ? '周' : '月'}管理费
                                </span>
                                    <span className="list-item-content">
                                        {manageFee}元
                                </span>
                                </div>
                            ) : ""}
                            {goId == 3 ? (
                                <div className="list-item">
                                    <span className="list-item-name">
                                        分成比例
                                </span>
                                    <span className="list-item-content">
                                        {separateFeeRate}
                                    </span>
                                </div>
                            ) : ""}

                            <div className="list-item" onClick={() => this.alert(0)}>
                                <span className="list-item-name">
                                    警戒线
                                    <img src={wenhao} alt="" />
                                </span>
                                <span className="list-item-content">
                                    {info.jjje}元
                                </span>
                            </div>
                            <div className="list-item" onClick={() => this.alert(1)}>
                                <span className="list-item-name">
                                    平仓线
                                    <img src={wenhao} alt="" />
                                </span>
                                <span className="list-item-content">
                                    {info.zsje}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    开始交易
                                </span>
                                <span className="list-item-content">
                                    {tradeDay}
                                </span>
                            </div>
                            <div className="list-item" onClick={() => this.chicang()}>
                                <span className="list-item-name">
                                    持仓限制
                                </span>
                                <img className="right-icon" src={right} alt="" />
                            </div>
                            <div className="list-item">
                                <div className="list-item-content" style={{ color: '#40affe' }}>
                                    {/* <input type="checkbox" name="" id="" [checked]='agreement' [(ngModel)]="agreement" />
                                    <span (click)='attention()'>已阅读并同意《操盘规则》</span> */}
                                </div>
                            </div>
                        </div>
                        <button className='submit' onClick={() => this.submit()}>
                            立即申请
                        </button>
                        <div className="bottombox"></div>
                    </div >
                </div >
            </div >

        );
    }
}

export default strategy;