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
            zsje: ""//平仓线
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
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

    // getManageFee() {
    //     let url = '/tn/tntg/theManageFee', method = 'post', options = null;
    //     httpAxios(url, method, false, options).then(res => {

    //     });
    // }
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
                    alert(res.resultInfo);
                }
            });
        });


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
        const { type, financeRatio, amount, day, month, single, makeFeeRate, financeFee, manageFee, separateFeeRate, jjje, zsje } = this.state;
        let plandom;
        if (type == 'day') {
            plandom = day.map(item => (
                <div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'day')}>
                    <div className="m1">
                        <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                    <div className="m2">
                        <span className="mm2">{item.financeRatio * amount}元</span>
                    </div>
                </div>
            ))
        } else if (type == 'month') {
            plandom = month.map(item => (
                <div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'month')}>
                    <div className="m1">
                        <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                    <div className="m2">
                        <span className="mm2">{item.financeRatio * amount}元</span>
                    </div>
                </div>
            ))
        } else if (type == 'single') {
            plandom = single.map(item => (
                <div key={item.id} className={financeRatio == item.financeRatio ? 'activeborder multiple' : 'multiple'} onClick={() => this.getFinanceRatio(item.financeRatio, 'single')}>
                    <div className="m1">
                        <span className="mm1">{item.financeRatio}</span>倍
                    </div>
                    <div className="m2">
                        <span className="mm2">{item.financeRatio * amount}元</span>
                    </div>
                </div>
            ))
        }
        return (
            /**
             * dataSource为数据数组
             * columns为表格的描述配置，列明什么之类的
             */
            <div>
                <div className="planmenu">
                    <span onClick={() => this.plans('day')}>
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
                    </span>
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
                            <div>
                                <span className="sleft">操盘资金</span>
                                <span className="sright">{financeRatio * amount}</span>
                            </div>
                            <div>
                                <span className="sleft">保证金</span>
                                <span className="sright">{amount}</span>
                            </div>
                            <div>
                                <span className="sleft">建仓费率</span>
                                <span className="sright">{makeFeeRate}</span>
                            </div>
                            <div>
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
                        </div>
                    </div>
                    <div className="tbox">
                        <div className="apply" onClick={() => this.deposit()}>立即申请</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;