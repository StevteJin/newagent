//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import { Input, Modal, Radio, Checkbox } from 'antd';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "day",
            financeRatio: "",
            amount: 0,
            day: [],
            month: [],
            single: [],
            makeFeeRate: "",//建仓费率
            financeFee: "",//管理费率
            manageFee: "",//管理费
            separateFeeRate: "",//分成比例
            jjje: "",//警戒线
            zsje: "",//平仓线
            allottedScale: "",
            visible: false,
            msg: "",
            tiaoyue: false,
            tiaoyue1: false,
            fwf: "",
            cpje: "",
            jjje: "",
            zsje: "",
            cordonLineRate: "",
            flatLineRate: "",
            date: "",
            positionRatio: "",
            secondBoardPositionRatio: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getInfo();
        this.getfinanceScheme();
        let date = this.getNowFormatDate();
        this.setState({
            date: date
        })
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
    getfinanceScheme() {
        let url = '/tn/tntg/financeScheme', method = 'post', options = null;
        let that = this;
        httpAxios(url, method, false, options).then(res => {
            let resultInfo = res.resultInfo;
            this.setState({
                day: resultInfo.day,
                month: resultInfo.month,
                single: resultInfo.single
            }, () => { })
        });
    }

    getInfo() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            if (res.allottedScale != 0) {
                this.setState({
                    allottedScale: res.allottedScale,
                    type: res.financePeriod,
                    financeRatio: res.financeRatio,
                    makeFeeRate: 0,
                    financeFee: 0,
                    totalScale: res.totalScale,
                    type: res.financePeriod
                }, () => {
                    this.getFinanceRatio(this.state.financeRatio, this.state.type)
                })
            }
        })
    }
    setmoney = e => {
        console.log('我是钱', e.target.value);
        this.setState({ amount: e.target.value }, () => {
            this.getFinanceRatio(this.state.financeRatio, this.state.type)
        })
    }
    onChange = e => {
        console.log(`checked = ${e.target.checked}`);
        this.setState({
            tiaoyue: `${e.target.checked}`
        })
    }
    changeBool() {
        let bool = this.state.tiaoyue1;
        bool = !bool;
        this.setState({
            tiaoyue1: bool
        })
    }

    deposit() {
        console.log('操盘规则', this.state.tiaoyue)
        if (this.state.amount % 1000 !== 0 || this.state.amount === null || this.state.amount <= 0) {
            this.setState({
                visible: true,
                msg: '投入金额必须是1000的倍数，且大于0'
            })
        } else {
            if (!this.state.financeRatio) {
                this.setState({
                    visible: true,
                    msg: '请先选择策略方案'
                })
            } else if (
                this.state.tiaoyue != 'true'
            ) {
                this.setState({
                    visible: true,
                    msg: '请先勾选操盘规则'
                })
            } else {
                let url = '/tn/tntg/capital', method = 'post', options = null;
                httpAxios(url, method, false, options).then(res => {
                    let expandScale = true;
                    if (res['allottedScale'] == '0') {
                        expandScale = true;
                    } else {
                        expandScale = false;
                    }
                    let urld = '/tn/tntg/deposit', methodd = 'post', optionsd = {
                        newStrategy: res['allottedScale'] !== '0' ? false : true,
                        financeRatio: this.state.financeRatio,
                        financePeriod: this.state.type,
                        amount: this.state.amount,
                        expandScale: expandScale
                    };;
                    httpAxios(urld, methodd, false, optionsd).then(resd => {
                        if (resd.success == true) {
                            this.props.history.push('/index');
                        } else {
                        }
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

        }
    }

    handleOk = e => {
        console.log(e);
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

    handleOk1 = e => {
        console.log(e);
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

    add(type) {
        let expandScale;
        if (type == 'true') {
            expandScale = true;
        } else {
            expandScale = false;
        }
        console.log('我是对错', expandScale)
        if (this.state.amount % 1000 !== 0 || this.state.amount === null || this.state.amount <= 0) {
            this.setState({
                visible: true,
                msg: '投入金额必须是1000的倍数，且大于0'
            })
        } else if (
            this.state.tiaoyue != 'true'
        ) {
            this.setState({
                visible: true,
                msg: '请先勾选操盘规则'
            })
        } else {
            if (type) { // 增配
                let urld = '/tn/tntg/deposit', methodd = 'post', optionsd = {
                    newStrategy: this.state.allottedScale !== '0' ? false : true,
                    financeRatio: this.state.financeRatio,
                    financePeriod: this.state.type,
                    amount: this.state.amount,
                    expandScale: expandScale
                };;
                httpAxios(urld, methodd, false, optionsd).then(resd => {
                    if (resd.success == true) {
                        this.props.history.push('/index');
                    } else {

                    }
                });
            } else { // 非增配
                let urld = '/tn/tntg/deposit', methodd = 'post', optionsd = {
                    newStrategy: this.state.allottedScale !== '0' ? false : true,
                    financeRatio: this.state.financeRatio,
                    financePeriod: this.state.type,
                    amount: this.state.amount,
                    expandScale: expandScale
                };;
                httpAxios(urld, methodd, false, optionsd).then(resd => {
                    if (resd.success == true) {
                        this.props.history.push('/index');
                    } else {

                    }
                });
            }
        }

    }

    plans(type) {
        this.setState({
            type: type
        })
    }
    getFinanceRatio(financeRatio, who) {
        let that = this;
        this.setState({
            financeRatio: financeRatio,
            type: who
        }, () => {
            if (who == 'day') {
                console.log('是我', this.state.day)
                this.state.day.forEach(element => {
                    if (element['financeRatio'] == this.state.financeRatio) {
                        that.setState({
                            makeFeeRate: element['makeFeeRate'],//建仓费率
                            financeFee: element['financeFeeRate'],//管理费率
                            manageFee: element['makeFeeRate'],//管理费
                            separateFeeRate: element['separateFeeRate'],//分成比例
                            cordonLineRate: element['cordonLineRate'],//警戒线
                            flatLineRate: element['flatLineRate'],//平仓线
                            positionRatio: element['positionRatio'],
                            secondBoardPositionRatio: element['secondBoardPositionRatio']
                        }, () => {
                            let fwf = (Math.round(that.state.makeFeeRate * that.state.financeRatio * that.state.amount * 100) / 100).toFixed(2);
                            that.setState({
                                fwf: fwf
                            }, () => {
                            })
                            let cpje, jjje, zsje;
                            if (this.state.allottedScale == 0) {
                                cpje = that.state.amount * (that.state.financeRatio + 1) + that.state.allottedScale;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            } else {
                                cpje = that.state.amount * (that.state.financeRatio + 1) * 2;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            }
                            that.setState({
                                cpje: cpje,
                                jjje: jjje,
                                zsje: zsje
                            }, () => {
                            })
                        })
                    }
                });
            } else if (who == 'month') {
                this.state.month.forEach(element => {
                    if (element['financeRatio'] == this.state.financeRatio) {
                        that.setState({
                            makeFeeRate: element['makeFeeRate'],//建仓费率
                            financeFee: element['financeFeeRate'],//管理费率
                            manageFee: element['makeFeeRate'],//管理费
                            separateFeeRate: element['separateFeeRate'],//分成比例
                            cordonLineRate: element['cordonLineRate'],//警戒线
                            flatLineRate: element['flatLineRate'],//平仓线
                            positionRatio: element['positionRatio'],
                            secondBoardPositionRatio: element['secondBoardPositionRatio']
                        }, () => {
                            let fwf = (Math.round(that.state.makeFeeRate * that.state.financeRatio * that.state.amount * 100) / 100).toFixed(2);
                            that.setState({
                                fwf: fwf
                            }, () => {
                            })
                            let cpje, jjje, zsje;
                            if (this.state.allottedScale == 0) {
                                cpje = that.state.amount * (that.state.financeRatio + 1) + that.state.allottedScale;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            } else {
                                cpje = that.state.amount * (that.state.financeRatio + 1) * 2;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            }
                            that.setState({
                                cpje: cpje,
                                jjje: jjje,
                                zsje: zsje
                            }, () => {
                            })
                        })
                    }
                });
            } else if (who == 'single') {
                this.state.single.forEach(element => {
                    if (element['financeRatio'] == this.state.financeRatio) {
                        that.setState({
                            makeFeeRate: element['makeFeeRate'],//建仓费率
                            financeFee: element['financeFeeRate'],//管理费率
                            manageFee: element['makeFeeRate'],//管理费
                            separateFeeRate: element['separateFeeRate'],//分成比例
                            cordonLineRate: element['cordonLineRate'],//警戒线
                            flatLineRate: element['flatLineRate'],//平仓线
                            positionRatio: element['positionRatio'],
                            secondBoardPositionRatio: element['secondBoardPositionRatio']
                        }, () => {
                            let fwf = (Math.round(that.state.makeFeeRate * that.state.financeRatio * that.state.amount * 100) / 100).toFixed(2);
                            that.setState({
                                fwf: fwf
                            }, () => {
                            })
                            let cpje, jjje, zsje;
                            if (this.state.allottedScale == 0) {
                                cpje = that.state.amount * (that.state.financeRatio + 1) + that.state.allottedScale;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            } else {
                                cpje = that.state.amount * (that.state.financeRatio + 1) * 2;
                                jjje = cpje * that.state.cordonLineRate;
                                zsje = cpje * that.state.flatLineRate;
                            }
                            that.setState({
                                cpje: cpje,
                                jjje: jjje,
                                zsje: zsje
                            }, () => {
                            })
                        })
                    }
                });
            }
        })

    }
    render() {
        const { type, financeRatio, amount, day, month, single, fwf, makeFeeRate, financeFee, manageFee, separateFeeRate, cpje, jjje, zsje, date, allottedScale, positionRatio, secondBoardPositionRatio } = this.state;
        let plandom;
        if (type == 'day') {
            plandom = day.map(item => (allottedScale == 0 ? (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'day')}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
            </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>) : (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>)

            ))
        } else if (type == 'month') {
            plandom = month.map(item => (allottedScale == 0 ? (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'month')}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
            </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>) : (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>)

            ))
        } else if (type == 'single') {
            plandom = single.map(item => (allottedScale == 0 ? (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'single')}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
            </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>) : (<div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'}>
                <div className="m1">
                    <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                <div className="m2">
                    <span className="mm2">{item.financeRatio * amount}元</span>
                </div>
            </div>)

            ))
        }
        return (
            /**
             * dataSource为数据数组
             * columns为表格的描述配置，列明什么之类的
             */
            <div>
                <Modal
                    title="提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <p>{this.state.msg}</p>
                </Modal>
                <Modal
                    title="操盘规则"
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
                <div className="planmenu">
                    {allottedScale == 0 ? (<div><span onClick={() => this.plans('day')}>
                        <div className={this.state.type === 'day' ? 'active' : ''} ></div>
                        <span className="a">日方案</span>
                    </span>
                        <span onClick={() => this.plans('month')}>
                            <div className={this.state.type === 'month' ? 'active1' : ''}></div>
                            <span className="a1">月方案</span>
                        </span>
                        <span onClick={() => this.plans('single')}>
                            <div className={this.state.type === 'single' ? 'active2' : ''}></div>
                            <span className="a2">单票方案</span>
                        </span></div>) : (<div><span>
                            <div className={this.state.type === 'day' ? 'active' : ''} ></div>
                            <span className="a">日方案</span>
                        </span>
                            <span>
                                <div className={this.state.type === 'month' ? 'active1' : ''}></div>
                                <span className="a1">月方案</span>
                            </span>
                            <span>
                                <div className={this.state.type === 'single' ? 'active2' : ''}></div>
                                <span className="a2">单票方案</span>
                            </span></div>)}

                </div>
                <div className="titlebox">
                    <div className="tbox">
                        <div className="toptitle1">1：请输入您的风险保证金 金额</div>
                        <Input type="number" className="topinput" onChange={this.setmoney} placeholder="金额" />
                    </div>
                    <div className="tbox">
                        <div className="toptitle2">2.请选择方案</div>
                        <div>
                            {plandom}
                        </div>
                    </div>
                    <div className="tbox">
                        <div className="toptitle3">3.方案详情</div>
                        <div className="strg">
                            <div>
                                <span className="sleft">操盘资金</span>
                                <span className="sright">{cpje}</span>
                            </div>
                            <div>{allottedScale == 0 ? (<span className="sleft">保证金</span>) : (<span className="sleft">新增保证金</span>)}
                                <span className="sright">{amount}</span>
                            </div>
                            <div>
                                <span className="sleft">建仓费</span>
                                <span className="sright">{fwf}</span>
                            </div>
                            <div>
                                <span className="sleft">建仓费率</span>
                                {allottedScale == 0 ? (<span className="sright">{makeFeeRate}</span>) : (<span className="sright">0</span>)}
                            </div>
                            <div>
                                <span className="sleft">管理费率</span>
                                {allottedScale == 0 ? (<span className="sright">{financeFee}</span>) : (<span className="sright">0</span>)}
                            </div>
                            <div>
                                <span className="sleft">警戒线</span>
                                <span className="sright">{jjje}</span>
                            </div>
                            <div>
                                <span className="sleft">平仓线</span>
                                <span className="sright">{zsje}</span>
                            </div>
                            <div>
                                <span className="sleft">开始交易</span>
                                <span className="sright">{date}</span>
                            </div>
                            <div>
                                <span className="sleft">持仓限制</span>
                                <span className="sright">个股持仓比例：{positionRatio}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;创业板持仓比例：{secondBoardPositionRatio}</span>
                            </div>
                        </div>
                    </div>
                    <div className="tbox">
                        <div className="ty">
                            <Checkbox onChange={this.onChange}></Checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="tiaoyue" onClick={() => this.changeBool()}>已阅读并同意操盘规则</span>
                        </div>
                        {allottedScale == 0 ? (<div className="apply" onClick={() => this.deposit()}>立即申请</div>) : (<div className="apply1"><span className="applya" onClick={() => this.add('true')}>加配</span>
                            <span className="applyb" onClick={() => this.add('false')}>补仓</span></div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;