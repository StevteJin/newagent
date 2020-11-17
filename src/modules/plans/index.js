//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import { Input } from 'antd';

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
            allottedScale: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getInfo();
        this.getfinanceScheme();
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
            this.setState({
                allottedScale: res.allottedScale,
                type: res.financePeriod,
                financeRatio: res.financeRatio,
                makeFeeRate: 0,
                financeFee: 0,
                totalScale: res.totalScale
            })
        })
    }

    deposit() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            let expandScale = true;
            if (res['allottedScale'] === '0') {
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
        });
    }

    add(type) {
        let expandScale;
        if (this.state.allottedScale === '0') {
            expandScale = true;
        } else {
            expandScale = false;
        }
        if (type) { // 增配
            this.fee = parseInt(this.state.totalScale, 0) - parseInt(this.state.allottedScale, 0);
            // if (this.fee < 0) {
            //     this.fee = Math.abs(this.fee);
            //     this.confirm = true;
            //     this.msgText = `预补足的费用为${this.fee}元，是否在本次增配中自动补足`;
            // } else {
            //     this.isAddFn();
            // }
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
            // if (this.money <= 0 || this.data.Decimal(this.money) > 2) {
            //     layer.open({
            //         content: '非增配入金金额必须大于0,且不能超过两位小数'
            //         , skin: 'msg'
            //         , time: 2
            //     });
            // } else {
            //     this.msgText = '是否确定入金';
            //     this.confirm = true;
            // }
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

    plans(type) {
        this.setState({
            type: type
        })
    }
    getFinanceRatio(financeRatio, who) {
        let that = this;
        this.setState({
            financeRatio: financeRatio
        }, () => {
            if (who == 'day') {
                this.state.day.forEach(element => {
                    if (element['financeRatio'] == this.state.financeRatio) {
                        that.setState({
                            makeFeeRate: element['makeFeeRate'],//建仓费率
                            financeFee: element['financeFeeRate'],//管理费率
                            manageFee: element['makeFeeRate'],//管理费
                            separateFeeRate: element['separateFeeRate'],//分成比例
                            jjje: element['cordonLineRate'],//警戒线
                            zsje: element['flatLineRate']//平仓线
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
                            jjje: element['cordonLineRate'],//警戒线
                            zsje: element['flatLineRate']//平仓线
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
                            jjje: element['cordonLineRate'],//警戒线
                            zsje: element['flatLineRate']//平仓线
                        })
                    }
                });
            }
        })

    }
    render() {
        const { type, financeRatio, amount, day, month, single, makeFeeRate, financeFee, manageFee, separateFeeRate, jjje, zsje, allottedScale } = this.state;
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
                        <Input className="topinput" onChange={e => this.setState({ amount: e.target.value })} placeholder="金额" />
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
                            {allottedScale == 0 ? (<div>
                                <span className="sleft">操盘资金</span>
                                <span className="sright">{financeRatio * amount}</span>
                            </div>) : ""}
                            <div>{allottedScale == 0 ? (<span className="sleft">保证金</span>) : (<span className="sleft">新增保证金</span>)}
                                <span className="sright">{amount}</span>
                            </div>
                            <div>
                                <span className="sleft">建仓费率</span>
                                <span className="sright">{makeFeeRate}</span>
                            </div>
                            {allottedScale == 0 ? (<div><div>
                                <span className="sleft">管理费率</span>
                                <span className="sright">{financeFee}</span>
                            </div>
                                <div>
                                    <span className="sleft">管理费</span>
                                    <span className="sright">{manageFee}</span>
                                </div>
                                <div>
                                    <span className="sleft">分成比例</span>
                                    <span className="sright">{separateFeeRate}</span>
                                </div>
                                <div>
                                    <span className="sleft">警戒线比例</span>
                                    <span className="sright">{jjje}</span>
                                </div>
                                <div>
                                    <span className="sleft">平仓线比例</span>
                                    <span className="sright">{zsje}</span>
                                </div>
                            </div>) : ""}

                        </div>
                    </div>
                    <div className="tbox">
                        {allottedScale == 0 ? (<div className="apply" onClick={() => this.deposit()}>立即申请</div>) : (<div className="apply1"><span className="applya" onClick={() => this.add('true')}>加配</span>
                            <span className="applyb" onClick={() => this.add('false')}>补仓</span></div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;