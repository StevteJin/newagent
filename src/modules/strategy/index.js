//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress, Checkbox } from 'antd';
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
            isAdd: false,
            makeFeeRate: "",
            financeFee: "",
            manageFee: "",
            strategyType: "",
            separateFeeRate: "",
            peiziData: "",
            financeData: "",
            dateText: "",
            dayType: ['day', 'week', 'month', 'single', 'strategy'],
            chicangShow: false,
            positionRatio: "",
            secondBoardPositionRatio: "",
            tiaoyue: false,
            visible: false,
            msg: "",
            visible2: false,
            a1: "",
            a2: "",
            a3: "",
            tiaoyue1: false,
            allottedScale: "",
            type: ""
        }
    }
    componentDidMount = () => {
        let goId = this.props.match.params.id;
        let isAdd = Boolean(localStorage.getItem("isAdd"));
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
            console.log('我啊', this.state.isAdd == true)
            if (this.state.isAdd == true) {
                this.getInfo();
                let url = '/tn/tntg/userInfo', method = 'post', options = null;
                httpAxios(url, method, false, options).then(res => {
                    let separateFeeRate = res['separateFeeRate'];
                    let fwf = (Math.round(res['manageMakeFeeRate'] * this.state.peiziData.mulType * this.state.peiziData.money * 100) / 100).toFixed(2);
                    this.setState({
                        separateFeeRate: separateFeeRate,
                        type: res.financePeriod
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
                    } else if (this.state.peiziData.type == 4) {
                        this.setState({
                            financeData: res['resultInfo']['strategy']
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

    getInfo() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            if (res.allottedScale != 0) {
                this.setState({
                    allottedScale: res.allottedScale
                }, () => {

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
                }, () => {

                })
            }
        });
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
        console.log('条约', this.state.tiaoyue, typeof (this.state.tiaoyue));
        if (this.state.tiaoyue == false || this.state.tiaoyue == 'false') {
            this.setState({
                visible: true,
                msg: "请先勾选操盘规则"
            })
        } else {
            const serviceFee = this.state.strategyType == 0 ? this.state.info.fwf : this.state.manageFee;
            let a1 = this.state.info.bzj;//保证金
            let a2 = serviceFee;//服务费
            let a3 = this.state.info.bzj;//共需支付
            this.setState({
                a1: a1,
                a2: a2,
                a3: a3,
                visible2: true
            })
            // this.submitAlert();
        }
    }

    onChange = e => {
        console.log(`checked = ${e.target.checked}`);
        this.setState({
            tiaoyue: `${e.target.checked}`
        })
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

    handleCancel2 = e => {
        console.log(e);
        this.setState({
            visible2: false,
        });
    };

    handleOk2 = e => {
        let isTime = true;
        let time = 0;
        let timeS;
        let that = this;
        if (time > 0) {
            timeS = setInterval(function () {
                time = time - 1;
            }, 1000);
        } else {
            time = 3
            clearInterval(timeS);
            isTime = false;
        }
        if (time == 3) {
            let url = '/tn/tntg/capital', method = 'post', options = null;
            httpAxios(url, method, false, options).then(res => {
                let leftMoney = res['balance'];
                let expandScale = true;
                if (res['allottedScale'] == 0) {
                    this.state.info.cpje = parseInt(res['allottedScale'], 0) + this.state.info.cpje;
                    expandScale = true;
                } else if (this.state.isAdd == true) {
                    expandScale = true;
                } else {
                    expandScale = false;
                }

                if (leftMoney < this.state.info.bzj) {
                    this.setState({
                        visible: true,
                        msg: "账户余额不足，请充值"
                    })
                    //跳转充值
                    let that = this;
                    setTimeout(() => {
                        that.props.history.push('/recharge');
                    }, 1000);
                } else {
                    const data = {
                        newStrategy: res['allottedScale'] !== '0' ? false : true,
                        financeRatio: this.state.peiziData.mulType,
                        financePeriod: this.state.dateText,
                        amount: this.state.peiziData.money,
                        expandScale: expandScale
                    };
                    httpAxios("/tn/tntg/deposit", 'post', false, data).then(res2 => {
                        this.setState({
                            visible: true,
                            msg: "申请成功"
                        })
                        let that = this;
                        setTimeout(() => {
                            that.props.history.push('/deposit/' + this.state.goId);
                        }, 1000);
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
        } else {
            this.setState({
                visible: true,
                msg: "请不要连续点击,1秒后再操作"
            })
        }
        // this.setState({
        //     visible2: false,
        // });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleOk1 = e => {
        console.log(e);
        if (this.state.msg == '请重新登录') {
            this.props.history.push('/login');
        }
        this.setState({
            tiaoyue1: false,
        });
    };

    handleCancel1 = e => {
        console.log(e);
        this.setState({
            tiaoyue1: false,
        });
    };

    changeBool() {
        let bool = this.state.tiaoyue1;
        bool = !bool;
        this.setState({
            tiaoyue1: bool
        })
    }

    render() {
        const { goId, info, isAdd, makeFeeRate, financeFee, manageFee, strategyType, separateFeeRate, tradeDay, chicangShow, positionRatio, secondBoardPositionRatio, a1, a2, a3, tiaoyue1, allottedScale, type } = this.state;
        return (
            <div>
                <Modal
                    title="操盘规则"
                    centered
                    visible={this.state.tiaoyue1}
                    onOk={this.handleOk1}
                    onCancel={this.handleCancel1}
                    okText="确定"
                    cancelText="取消"
                >
                    <p>注意事项：</p>
                    <p>1.不得购买S、ST、*ST、S*ST、SST、以及被交易所特别处理的股票；</p>
                    <p>2.当操盘资金低于亏损警戒线时，需尽快补足风险保证金，且不能买入股票；</p>
                    <p>3.当操盘资金低于平仓线下时，我们有权将您账户里的股票实行卖出处理；</p>
                    <p>4.客户有停牌股票，可以继续支付账户管理费延续账户直至停牌结束，
      并在停牌股票持有的当天算起3天内追加停牌股票市值30%的保证金；</p>
                    <p>5.客户有停牌股票，不再补缴保证金，且不支付账户管理费，
      默认为放弃该账户权益，账户盈亏和客户无关，不退还任何资金；</p>
                    <p>6.操盘手提供劣后资金，可用资金为资金方提供的授信可用优先资金，当后台账户资不够时，即使操盘人在可用资金额度内提交新的买入委托可能会出现买入失败；
                    </p>
                    <p>7.合作过程中出现亏损全部由操盘手负责并从劣后资金中扣除，如果劣后资金不够扣除亏损则由操盘手日内补足</p>
                    <p>8.利润分配：合作期间按免息盈利分成，账户持有个股在卖出时有盈利则分，无盈利则不分成；</p>
                    <p>9.结算期限及费用：免息日结算前清仓的，不收取管理费，如到时操盘手未清仓的，资金方将按天收取持仓市值的管理费；</p>
                </Modal>
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
                <Modal
                    title="费用"
                    centered
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel2}
                    okText="立即申请"
                    cancelText="取消">
                    <p>保证金{a1}</p>
                    <p>服务费{a2}</p>
                    <p>共需支付{a3}</p>
                </Modal>
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
                                    {isAdd == true ? "新增" : ""}保证金
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
                                {allottedScale == 0 ?
                                    (
                                        <span className="list-item-content">
                                            {goId == 4 ? 0 : makeFeeRate}
                                        </span>) : (<span className="list-item-content">0</span>)}
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    管理费率
                                </span>
                                {allottedScale == 0 ? (
                                    <span className="list-item-content">
                                        {goId == 4 ? 0 : financeFee}
                                    </span>) : (<span className="list-item-content">0</span>)}
                            </div>
                            {type == 'month' ? (
                                <div className="list-item">
                                    <span className="list-item-name">
                                        本月管理费
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
                                <div className="list-item-content listcheck" style={{ color: '#40affe' }}>
                                    {/* <input type="checkbox" name="" id="" [checked]='agreement' [(ngModel)]="agreement" />
                                    <span (click)='attention()'>已阅读并同意《操盘规则》</span> */}
                                    <Checkbox onChange={this.onChange}></Checkbox>
                                    <span className="tiaoyue" onClick={() => this.changeBool()}>已阅读并同意操盘规则</span>
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